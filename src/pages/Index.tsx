import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Calculator, Car, Moon, Package } from "lucide-react";

const Index = () => {
  const [distance, setDistance] = useState<string>("");
  const [waitingTime, setWaitingTime] = useState<string>("");
  const [baggage, setBaggage] = useState<string>("");
  const [isNightRate, setIsNightRate] = useState<boolean>(false);
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  const [breakdown, setBreakdown] = useState<{
    baseFare: number;
    distanceCost: number;
    waitingCost: number;
    subtotal: number;
    baggageCost: number;
  } | null>(null);

  const calculatePrice = () => {
    const distanceKm = parseFloat(distance);
    const waitingMin = parseFloat(waitingTime);
    const baggageCount = parseFloat(baggage);

    if (isNaN(distanceKm) || distanceKm < 0) {
      return;
    }

    // Pricing based on official document:
    // Base fare: 900 millimes = 0.900 TND
    const baseFare = 0.900;
    
    // Distance: 46 millimes per 79 meters
    const distanceMeters = distanceKm * 1000;
    const distanceCost = (distanceMeters / 79) * 0.046;
    
    // Waiting time: 46 millimes per 18 seconds
    const waitingCost = (!isNaN(waitingMin) && waitingMin > 0) ? ((waitingMin * 60) / 18) * 0.046 : 0;
    
    // Calculate subtotal before night rate
    let subtotal = baseFare + distanceCost + waitingCost;
    
    // Apply night rate (50% increase) if enabled
    if (isNightRate) {
      subtotal = subtotal * 1.5;
    }
    
    // Baggage cost (not affected by night rate)
    const baggageCost = (!isNaN(baggageCount) && baggageCount > 0) ? baggageCount * 1.00 : 0;
    
    const total = subtotal + baggageCost;
    
    setBreakdown({
      baseFare,
      distanceCost,
      waitingCost,
      subtotal,
      baggageCost
    });
    setTotalPrice(parseFloat(total.toFixed(3)));
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Car className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Tunisia Taxi Calculator</h1>
          </div>
          <p className="text-muted-foreground">Calculate your estimated taxi fare</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Fare Calculator
            </CardTitle>
            <CardDescription>Enter trip details to estimate your fare</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="distance">Distance (km)</Label>
              <Input
                id="distance"
                type="number"
                placeholder="0.0"
                min="0"
                step="0.1"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="waiting">Waiting Time (minutes)</Label>
              <Input
                id="waiting"
                type="number"
                placeholder="0"
                min="0"
                step="1"
                value={waitingTime}
                onChange={(e) => setWaitingTime(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Optional - leave blank if no waiting time</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="baggage">Big Packages Count</Label>
              <Input
                id="baggage"
                type="number"
                placeholder="0"
                min="0"
                step="1"
                value={baggage}
                onChange={(e) => setBaggage(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">1.00 TND per big package</p>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30">
              <div className="flex items-center gap-2">
                <Moon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="night-mode" className="cursor-pointer">Night Rate (9PM - 5AM)</Label>
                  <p className="text-xs text-muted-foreground">+50% surcharge</p>
                </div>
              </div>
              <Switch
                id="night-mode"
                checked={isNightRate}
                onCheckedChange={setIsNightRate}
              />
            </div>

            <Button 
              onClick={calculatePrice} 
              className="w-full"
              size="lg"
            >
              Calculate Fare
            </Button>

            {totalPrice !== null && breakdown && (
              <div className="mt-6 p-6 bg-primary/10 rounded-lg border-2 border-primary/20">
                <p className="text-sm text-muted-foreground mb-1">Estimated Total</p>
                <p className="text-4xl font-bold text-primary">{totalPrice.toFixed(3)} TND</p>
                <div className="mt-4 pt-4 border-t border-border space-y-1 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Base fare:</span>
                    <span>{breakdown.baseFare.toFixed(3)} TND</span>
                  </div>
                  {distance && parseFloat(distance) > 0 && (
                    <div className="flex justify-between">
                      <span>Distance ({distance} km):</span>
                      <span>{breakdown.distanceCost.toFixed(3)} TND</span>
                    </div>
                  )}
                  {waitingTime && parseFloat(waitingTime) > 0 && (
                    <div className="flex justify-between">
                      <span>Waiting ({waitingTime} min):</span>
                      <span>{breakdown.waitingCost.toFixed(3)} TND</span>
                    </div>
                  )}
                  {isNightRate && (
                    <div className="flex justify-between font-medium text-primary">
                      <span>Night rate (+50%):</span>
                      <span>{breakdown.subtotal.toFixed(3)} TND</span>
                    </div>
                  )}
                  {baggage && parseFloat(baggage) > 0 && (
                    <div className="flex justify-between">
                      <span>Baggage ({baggage} package{parseFloat(baggage) > 1 ? 's' : ''}):</span>
                      <span>{breakdown.baggageCost.toFixed(3)} TND</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center text-xs text-muted-foreground">
          <p>Rates based on official Tunisian Ministry of Transportation pricing</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
