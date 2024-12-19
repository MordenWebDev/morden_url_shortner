import { useState, useEffect } from 'react';
import {  getdashboardkpy} from "@/api/dashboard";
import moment from 'moment';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Link, Lock, MousePointer, PlusCircle } from 'lucide-react'
const Dashboard = () => {
  const [data, setData] = useState({
    totalLinks: 0,
    totalClicks: 0,
    linksToday: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Function to fetch data from the API
    const fetchDashboardData = async () => {
      try {
   
        const response = await getdashboardkpy()

        // Set the data in state
        setData(response.data);
        setLoading(false); 
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false); // Stop loading if there is an error
      }
    };

    fetchDashboardData();
  }, []); // Empty dependency array ensures this runs once when the component is mounted
  const formatDate = (dateString) => {
    return moment(new Date(dateString)).format("MMM D, YYYY HH:mm");
  }

  const getLinkTypeIcon = (linkType) => {
    if (linkType.includes("password_protected")) {
      return <Lock className="h-4 w-4" />
    }
    return null
  }
  // Loading state while data is being fetched
  if (loading) {
    return <>loading...</>
  }

  return (<>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {[
      { title: "Total Links", value: data?.totalLinks, icon: Link },
      { title: "Total Clicks", value: data?.totalClicks, icon: MousePointer },
      { title: "Links Today", value: data?.linksToday, icon: PlusCircle },
    ].map((item) => (
      <div
        key={item.title}
        
 
      >
        <Card className="overflow-hidden">
          <CardHeader className="space-y-1 bg-black text-white">
            <CardTitle className="text-2xl">{item.title}</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <item.icon className="h-10 w-10 text-black-500" />
              <span className="text-4xl font-bold">{item?.value}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    ))}
  </div>
  
  <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Recently Generated Links</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Short URL</TableHead>
              <TableHead>Original URL</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.recentLinks?.map((link) => (
              <TableRow key={link._id}>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a
                          href={`/acess/${link.shortUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 text-blue-500 hover:underline"
                        >
                          <Link className="h-4 w-4" />
                          <span>{link.shortUrl}</span>
                        </a>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Click to open shortened link</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell className="max-w-xs truncate" title={link.originalUrl}>
                  {link.originalUrl}
                </TableCell>
                <TableCell>{formatDate(link.createdAt)}</TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(link.expiryDate)}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Expiry date</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>
                <Badge variant="outline" className="flex items-center space-x-1 py-1 px-2">
  {getLinkTypeIcon(link.linkType)}
  <span>{link.linkType.replace(/_/g, " ")}</span>
</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </>
  );
};

export default Dashboard;
