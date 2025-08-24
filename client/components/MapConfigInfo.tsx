import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FiInfo as Info,
  FiMapPin as MapPin,
  FiExternalLink as ExternalLink,
  FiSettings as Settings,
} from "react-icons/fi";

export default function MapConfigInfo() {
  const isDemo = false; // Now using real Google Maps

  return (
    <Card className="glass border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center text-gradient">
          <MapPin className="mr-2 h-5 w-5 text-primary" />
          Map Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isDemo ? (
          <>
            {/* Demo Mode Alert */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Currently using{" "}
                <Badge className="mx-1 bg-blue-500/20 text-blue-400">
                  Interactive Demo Map
                </Badge>
                - a fully functional map interface that doesn't require API
                keys.
              </AlertDescription>
            </Alert>

            {/* Demo Features */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gradient">
                Demo Features
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>Location selection</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>Route visualization</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>Zoom controls</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>Map styles</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>Search interface</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>Marker placement</span>
                </div>
              </div>
            </div>

            {/* Upgrade to Real Maps */}
            <div className="space-y-3 p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
              <h4 className="text-sm font-medium text-blue-400">
                Upgrade to Real Google Maps
              </h4>
              <p className="text-xs text-muted-foreground">
                Get satellite imagery, real addresses, and live traffic data.
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex items-start space-x-2">
                  <span className="text-blue-400 mt-0.5">1.</span>
                  <span>Get API key from Google Cloud Console</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-400 mt-0.5">2.</span>
                  <span>Enable Maps JavaScript API</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-400 mt-0.5">3.</span>
                  <span>Add VITE_GOOGLE_MAPS_API_KEY to .env</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-400 mt-0.5">4.</span>
                  <span>Restart development server</span>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={() =>
                  window.open(
                    "https://console.cloud.google.com/apis/library/maps-backend.googleapis.com",
                    "_blank",
                  )
                }
              >
                <ExternalLink className="mr-2 h-3 w-3" />
                Get Google Maps API Key
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Real Maps Active */}
            <Alert>
              <Settings className="h-4 w-4" />
              <AlertDescription>
                <Badge className="mr-1 bg-green-500/20 text-green-400">
                  Google Maps Active
                </Badge>
                Using real Google Maps with satellite imagery and live data.
              </AlertDescription>
            </Alert>

            {/* Real Maps Features */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gradient">
                Active Features
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>Satellite imagery</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>Real addresses</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>Live traffic data</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>Places search</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>Turn-by-turn directions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>Real-time location</span>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
