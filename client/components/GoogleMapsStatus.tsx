import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function GoogleMapsStatus() {
  const hasApiKey = !!import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const isValidKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY !== "demo-key";
  const isActive = hasApiKey && isValidKey;

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          {isActive ? (
            <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="mr-2 h-5 w-5 text-red-500" />
          )}
          Google Maps Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">API Key Status:</span>
            {isActive ? (
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <CheckCircle className="mr-1 h-3 w-3" />
                Active
              </Badge>
            ) : (
              <Badge className="bg-red-100 text-red-800 border-red-200">
                <XCircle className="mr-1 h-3 w-3" />
                Not Configured
              </Badge>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Map Type:</span>
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
              Real Google Maps
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Features:</span>
            <span className="text-sm text-gray-600">
              Satellite, Street View, Traffic
            </span>
          </div>

          {isActive && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  Google Maps is active and ready!
                </span>
              </div>
              <p className="text-xs text-green-700 mt-1">
                You now have access to real satellite imagery, places search, and live traffic data.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
