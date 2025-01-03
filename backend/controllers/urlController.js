import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import Url from "../models/Url.js";
import moment from 'moment';
export const generateShortUrl = async (req, res) => {
  const { originalUrl, password, expiryDate } = req.body;

  // Validate original URL
  if (!originalUrl || typeof originalUrl !== "string") {
    return res
      .status(400)
      .json({ message: "Invalid or missing original URL." });
  }

  try {
    // Generate a unique short URL
    const shortUrl = nanoid(8);

    // Hash the password if provided
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    // Validate expiryDate if provided
    if (expiryDate) {
      const expiry = new Date(expiryDate);
      if (expiry <= new Date()) {
        return res
          .status(400)
          .json({ message: "Expiry date must be in the future." });
      }
    }

    // Determine link type
    let linkType = "open";
    if (password && expiryDate) {
      linkType = "password_protected_and_expiry";
    } else if (password) {
      linkType = "password_protected";
    } else if (expiryDate) {
      linkType = "expiry";
    }

    // Create the new URL document with optional fields
    const url = new Url({
      originalUrl,
      shortUrl,
      linkType,
      createdBy: req.user.userId,
      password: hashedPassword,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
    });

    // Save the URL document to the database
    await url.save();

    // Respond with the generated short URL and link type
    res.status(201).json({
      shortUrl,
      linkType,
      message: "Short URL generated successfully.",
    });
  } catch (error) {
    console.error("Error generating short URL:", error);

    // Handle duplicate short URL errors
    if (error.code === 11000 && error.keyPattern?.shortUrl) {
      return res
        .status(500)
        .json({ message: "Short URL conflict. Please try again." });
    }

    res.status(500).json({ message: "Error generating short URL." });
  }
};
export const getUserUrlsWithPagination = async (req, res) => {
  try {
    // Retrieve the user ID from the request object
    const userId = req.user.userId;

    // Get pagination parameters from query (default: page 1, limit 10)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Fetch URLs with pagination
    const urls = await Url.find({ createdBy: userId })
      .select("originalUrl shortUrl linkType expiryDate visitCount")
      .skip(skip)
      .limit(limit);

    // Get the total count of URLs for the user
    const totalUrls = await Url.countDocuments({ createdBy: userId });

    // Return paginated results and metadata
    res.status(200).json({data:{
      urls,
      totalUrls,
      currentPage: page,
      totalPages: Math.ceil(totalUrls / limit),
      hasNextPage: page < Math.ceil(totalUrls / limit),
      hasPreviousPage: page > 1,}
    });
  } catch (error) {
    console.error("Error retrieving user URLs with pagination:", error);
    res.status(500).json({ message: "Error retrieving user URLs." });
  }
};
export const editUserUrl = async (req, res) => {
  const { shortUrl } = req.params; // Short URL as an identifier
  const { originalUrl, password, expiryDate } = req.body;

  try {
    // Find the URL by shortUrl and ensure it belongs to the current user
    const url = await Url.findOne({ shortUrl, createdBy: req.user.userId });

    if (!url) {
      return res
        .status(404)
        .json({ message: "URL not found or you do not have access." });
    }

    // Update fields only if they are provided in the request
    if (originalUrl) {
      if (typeof originalUrl !== "string") {
        return res.status(400).json({ message: "Invalid original URL." });
      }
      url.originalUrl = originalUrl;
    }

    if (password) {
      url.password = await bcrypt.hash(password, 10); // Hash new password if provided
    }

    if (expiryDate) {
      if (new Date(expiryDate) <= new Date()) {
        return res
          .status(400)
          .json({ message: "Expiry date must be in the future." });
      }
      url.expiryDate = expiryDate;
    }

    // Dynamically set linkType based on fields
    if (password && expiryDate) {
      url.linkType = "password_protected_and_expiry";
    } else if (password) {
      url.linkType = "password_protected";
    } else if (expiryDate) {
      url.linkType = "expiry";
    } else {
      url.linkType = "open";
    }

    // Save the updated URL
    await url.save();

    res.status(200).json({ message: "URL updated successfully.", url });
  } catch (error) {
    console.error("Error editing URL:", error);
    res.status(500).json({ message: "Error editing URL." });
  }
};
export const deleteUserUrl = async (req, res) => {
  const { shortUrl } = req.params; // Short URL as an identifier

  try {
    // Find the URL by shortUrl and ensure it belongs to the current user
    const url = await Url.findOneAndDelete({
      shortUrl,
      createdBy: req.user.userId,
    });

    // If the URL is not found
    if (!url) {
      return res
        .status(404)
        .json({ message: "URL not found or you do not have access." });
    }

    res.status(200).json({ message: "URL deleted successfully." });
  } catch (error) {
    console.error("Error deleting URL:", error);
    res.status(500).json({ message: "Error deleting URL." });
  }
};



export const dashboard = async (req, res) => {
  try {
    const userId = req.user.userId; // Extract userId from the request

    // Using Moment.js for date manipulation
    const today = moment().startOf('day').toDate(); // Start of today
    const sixDaysAgo = moment().subtract(6, 'days').startOf('day').toDate(); // 6 days ago, start of the day

    // Aggregate all data for the user
    const [totalLinks, totalClicks, linksToday, chartData, recentLinks] = await Promise.all([
      // Total number of links for the user
      Url.countDocuments({ createdBy: userId }),

      // Total number of link clicks for the user
      Url.aggregate([
        { $match: { createdBy: userId } },
        { $group: { _id: null, totalVisits: { $sum: "$visitCount" } } },
      ]).then((data) => (data.length > 0 ? data[0].totalVisits : 0)),

      // Number of links generated today by the user
      Url.countDocuments({ createdBy: userId, createdAt: { $gte: today } }),

      // Links generated over the last 6 days by the user, including today
      Url.aggregate([
        { $match: { createdBy: userId, createdAt: { $gte: sixDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      // Recent links generated by the user
      Url.find({ createdBy: userId })
        .sort({ createdAt: -1 })
        .limit(3)
        .select("originalUrl shortUrl createdAt linkType expiryDate"),
    ]);

    // Ensure today's data is included in the chart data
    const todayDate = moment().format('YYYY-MM-DD');
    if (!chartData.some((data) => data._id === todayDate)) {
      chartData.push({ _id: todayDate, count: linksToday });
    }

    // Sort chart data by date
    chartData.sort((a, b) => moment(a._id).isBefore(b._id) ? -1 : 1);

    // Send consolidated response
    res.json({data:{
      totalLinks,
      totalClicks,
      linksToday,
      chartData,
      recentLinks,
    }});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const redirect = async (req, res) => {
  const { shortUrl } = req.params;
  const { password } = req.query;

  try {
    const url = await Url.findOne({ shortUrl });

    if (!url) {
      return res.status(404).json({ message: "URL not found." });
    }

    if (url.expiryDate && new Date() > url.expiryDate) {
      return res.status(410).json({ message: "URL has expired." });
    }

    if (url.password) {
      if (!password) {
        return res.status(401).json({ message: "Password required." });
      }

      const isPasswordValid = await bcrypt.compare(password, url.password);
      if (!isPasswordValid) {
        return res.status(403).json({ message: "Invalid password." });
      }
    }

    url.visitCount += 1;
    await url.save();

    res.status(200).json({success:true,redirecturl:url.originalUrl})
  } catch (error) {
    console.error("Error during redirect:", error);
    res.status(500).json({ message: "Internal server error during redirect." });
  }
};
