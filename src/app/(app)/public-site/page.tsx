
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, Copy, Eye, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

export default function PublicSitePage() {
  const businessName = "Harrys Barbers";
  const derivedUrl = businessName.toLowerCase().replace(/\s+/g, '');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Public Site</h1>
        <Button>Save Changes</Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Customize Your Booking Page</CardTitle>
                    <CardDescription>This is what your clients will see when they visit your booking page.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="space-y-2">
                        <Label>Shop Logo</Label>
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-lg bg-secondary flex items-center justify-center border">
                                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline"><Upload className="mr-2" /> Upload Logo</Button>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Upload your shop logo (max 1MB). This will be displayed prominently on your public booking page.
                            <br />
                            Recommended: Square image, 500x500 pixels or smaller for best performance.
                        </p>
                    </div>
                     <div className="space-y-2">
                        <Label>Custom URL</Label>
                        <div className="flex items-center p-2 rounded-md bg-muted border">
                           <p className="text-sm font-medium">{derivedUrl}<span className="text-muted-foreground">.nubarber.com</span></p>
                        </div>
                         <p className="text-sm text-muted-foreground">
                            Your custom URL is automatically generated from your business name: {businessName}.
                        </p>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="headline">Headline</Label>
                        <Input id="headline" defaultValue="Book your next appointment with us" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" defaultValue="Easy and fast booking, available 24/7." />
                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Your Booking URL</CardTitle>
                    <CardDescription>Share this link with your clients.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-900">
                        <p><strong>Current:</strong> https://www.nubarber.com/{derivedUrl}</p>
                        <p><strong>Future:</strong> {derivedUrl}.nubarber.com (requires DNS setup)</p>
                    </div>
                    <div className="flex items-center">
                        <Input readOnly value={`https://www.nubarber.com/${derivedUrl}`} />
                        <Button variant="ghost" size="icon" className="ml-2">
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                    <Button className="w-full"><Eye className="mr-2"/> Preview Website</Button>
                     <p className="text-xs text-muted-foreground text-center">
                        Debug: Preview URL will be https://www.nubarber.com/{derivedUrl}
                    </p>
                </CardContent>
            </Card>
             <Card className="hidden lg:block">
                <CardHeader>
                    <CardTitle>Website Preview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="aspect-video bg-secondary rounded-lg flex items-center justify-center">
                         <Image src="https://placehold.co/1920x1080.png" alt="Website preview" width={1920} height={1080} className="rounded-md" data-ai-hint="website screenshot" />
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
