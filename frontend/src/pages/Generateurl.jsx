
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, LockIcon, ClockIcon, LinkIcon } from 'lucide-react'
import moment from 'moment';

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { createurl } from "@/api/url"; 
import toast from 'react-hot-toast';

export default function UrlShortenerForm() {
  const [url, setUrl] = useState('')
  const [expiry, setExpiry] = useState()
  const [password, setPassword] = useState('')
  const [useExpiry, setUseExpiry] = useState(false)
  const [usePassword, setUsePassword] = useState(false)
  const [shortUrls, setShortUrls] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Check if URL is provided
    if (!url) {
      toast.error("URL is required!");
      return;
    }
  
    // Check if password is required but not provided
    if (usePassword && !password) {
      toast.error("Password is required when the password protection is enabled.");
      return;
    }
  
    // Check if expiry date is required but not provided
    if (useExpiry && !expiry) {
      toast.error("Expiry date is required when the expiry option is enabled.");
      return;
    }
  
    try {
      let data = {
        originalUrl: url,
      };
  
      // Add password if usePassword is true
      if (usePassword) {
        data.password = password;
      }
  
      // Add expiry date if useExpiry is true
      if (useExpiry) {
        data.expiryDate = expiry;
      }
  
      // Create the URL
      let response = await createurl(data);
  
      // Clear the form fields after successful submission
      setUrl('');
      setExpiry(undefined);
      setPassword('');
      toast.success("URL created successfully!");
  
    } catch (error) {
      // Handle any errors during the process
      toast.error(error.response.data.message || "Something went wrong. Please try again.");
    }
  };

  // const getUrlType = (url) => {
  //   if (url.expiry && url.password) return 'Expiring & Password Protected'
  //   if (url.expiry) return 'Expiring'
  //   if (url.password) return 'Password Protected'
  //   return 'Standard'
  // }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="url">URL to shorten</Label>
          <Input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            required
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="use-expiry"
            checked={useExpiry}
            onCheckedChange={setUseExpiry}
          />
          <Label htmlFor="use-expiry">Add expiry date</Label>
        </div>
        {useExpiry && (
          <div>
            <Label>Expiry date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !expiry && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {expiry ? moment(expiry).format('MMM D, YYYY HH:mm') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={expiry}
                  onSelect={setExpiry}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <Switch
            id="use-password"
            checked={usePassword}
            onCheckedChange={setUsePassword}
          />
          <Label htmlFor="use-password">Add password protection</Label>
        </div>
        {usePassword && (
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a password"
            />
          </div>
        )}
        <Button type="submit">Generate Short URL</Button>
      </form>
      {/* <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Generated Short URLs</h2>
        {shortUrls.map((shortUrl, index) => (
          <Card key={index} className="mb-4">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Short URL #{index + 1}</span>
                <Badge>{getUrlType(shortUrl)}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center">
                <LinkIcon className="mr-2 h-4 w-4" />
                <p><strong>Original URL:</strong> {shortUrl.original}</p>
              </div>
              <div className="flex items-center">
                <LinkIcon className="mr-2 h-4 w-4" />
                <p><strong>Shortened URL:</strong> {shortUrl.shortened}</p>
              </div>
              {shortUrl.expiry && (
                <div className="flex items-center">
                  <ClockIcon className="mr-2 h-4 w-4" />
                  <p><strong>Expiry Date:</strong> {shortUrl?.expiry?moment(shortUrl.expiry).format('MMM D, YYYY HH:mm'):"no"}</p>
                </div>
              )}
              {shortUrl.password && (
                <div className="flex items-center">
                  <LockIcon className="mr-2 h-4 w-4" />
                  <p><strong>Password Protected:</strong> Yes</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div> */}
    </div>
  )
}