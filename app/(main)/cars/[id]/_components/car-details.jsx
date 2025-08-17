"use client";
import { toggleSavedCar } from "@/actions/car-listing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useFetch from "@/hooks/use-fetch";
import { formatCurrency } from "@/lib/helper";
import { useAuth } from "@clerk/nextjs";
import {
  Calendar,
  Car,
  Currency,
  Fuel,
  Gauge,
  Heart,
  MessageSquare,
  MessageSquareOff,
  Share2,
  Map as MapIcon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import EmiCalculator from "./emi-calculator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { format } from "date-fns";

const CarDetails = ({ car, testDriveInfo }) => {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(car.wishlisted);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const {
    loading: savingCar,
    fn: toggleSavedCarFn,
    data: toggleResult,
    error: toggleError,
  } = useFetch(toggleSavedCar);

  useEffect(() => {
    if (toggleResult?.success && toggleResult.saved !== isWishlisted) {
      setIsWishlisted(toggleResult.saved);
      toast.success(toggleResult.message);
    }
  }, [toggleResult, isWishlisted]);

  useEffect(() => {
    if (toggleError) {
      toast.error("Failed to update favourites");
    }
  }, [toggleError]);

  const handleSaveCar = async (e) => {
    e.preventDefault();

    if (!isSignedIn) {
      toast.error("Please sign in to save cars");
      router.push("/sign-in");
      return;
    }

    if (savingCar) return;
    await toggleSavedCarFn(car.id);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${car.year} ${car.make} ${car.model}`,
          text: `Check out this ${car.year} ${car.make} ${car.model} on MotorAi`,
          url: window.location.url,
        })
        .catch((error) => {
          console.log("Error Sharing", error);
          copyToClipboard();
        });
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link Copied to Clipboard");
  };

  const handleBookTestDrive = () => {
    if (!isSignedIn) {
      toast.error("Please sign in to book a test-drive");
      router.push("/sign-in");
      return;
    }
    router.push(`/test-drive/${car.id}`);
  };
  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-7/12">
          <div className="aspect-video rounded-lg overflow-hidden relative mb-4">
            {car.images && car.images.length > 0 ? (
              <Image
                src={car.images[currentImageIndex]}
                alt={`${car.year} ${car.make} ${car.model}`}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <Car className="h-24 w-24 text-gray-400" />
              </div>
            )}
          </div>

          {car.images && car.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {car.images.map((image, index) => {
                return (
                  <div
                    key={index}
                    className={`relative cursor-pointer rounded-md h-20 w-24 flex-shrink-0 transition ${
                      index === currentImageIndex
                        ? "border-2 border-blue-700"
                        : "opacity-70 hover:opacity-100"
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <Image
                      src={image}
                      alt={`${car.year} ${car.make} ${car.model} - view ${
                        index + 1
                      }`}
                      fill
                      className="object-cover"
                    />
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex mt-4 gap-4">
            <Button
              variant="outline"
              className={`flex items-center gap-2 flex-1 ${
                isWishlisted ? "text-red-500" : ""
              }`}
              onClick={handleSaveCar}
              disabled={savingCar}
            >
              <Heart
                className={`h-5 w-5 ${isWishlisted ? "fill-red-500" : ""}`}
              />
              {isWishlisted ? "Saved" : "Save"}
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 flex-1"
              onClick={handleShare}
            >
              <Share2 className="h-5 w-5" />
              Share
            </Button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Badge className="mb-2">{car.bodyType}</Badge>
          </div>

          <h1 className="text-4xl font-bold mb-1">
            {car.year} {car.make} {car.model}
          </h1>

          <div className="text-2xl font-bold text-blue-600">
            {formatCurrency(car.price)}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-6">
            <div className="flex items-center gap-2">
              <Gauge className="text-gray-500 h-5 w-5" />
              <span>{car.mileage.toLocaleString()} miles</span>
            </div>
            <div className="flex items-center gap-2">
              <Fuel className="text-gray-500 h-5 w-5" />
              <span>{car.fuelType}</span>
            </div>
            <div className="flex items-center gap-2">
              <Car className="text-gray-500 w-5 h-5" />
              <span>{car.transmission}</span>
            </div>
          </div>

          <Dialog>
            <DialogTrigger className="w-full text-start">
              <Card>
                <CardContent>
                  <div className="flex items-center gap-2 text-lg font-medium mb-2">
                    <Currency className="h-5 w-5 text-blue-600" />
                    <h3>EMI Calculator</h3>
                  </div>
                  <div className="text-sm text-gray-600">
                    Estimated Monthly Payment:{" "}
                    <span className="font-bold text-gray-900">
                      {formatCurrency(car.price / 60)}
                    </span>{" "}
                    for 60 months
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    *Based on $0 down payment and 4.5% interest rate
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>EMI Calculator</DialogTitle>
                <EmiCalculator price={car.price} />
              </DialogHeader>
            </DialogContent>
          </Dialog>

          <Card className="my-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-lg font-medium mb-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <h3>Any Questions?</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Our representatives are available to answer all your queries
                about this vehicle
              </p>
              <a href="mailto:help@motorai.in">
                <Button variant="outline" className="w-full">
                  Request Info
                </Button>
              </a>
            </CardContent>
          </Card>

          {(car.status === "SOLD" || car.status === "UNAVAILABLE") && (
            <Alert variant="destructive">
              <AlertTitle className="capitalize">
                This car is {car.status.toLowerCase()}
              </AlertTitle>
              <AlertDescription>Please check again later.</AlertDescription>
            </Alert>
          )}

          {car.status !== "SOLD" && car.status !== "UNAVAILABLE" && (
            <Button
              className="w-full py-6 text-lg"
              disabled={testDriveInfo.userTestDrive}
              onClick={handleBookTestDrive}
            >
              <Calendar className="mr-2 h-5 w-5" />
              {testDriveInfo.userTestDrive
                ? `Booked for ${format(
                    new Date(testDriveInfo.userTestDrive.bookingDate),
                    "EEEE,MMMM d, yyyy"
                  )}`
                : "Book Test Drive"}
            </Button>
          )}
        </div>
      </div>

      <div className="mt-12 p-6 bg-white rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-6">Description</h3>
            <p className="whitespace-pre-line text-gray-700">
              {car.description}
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-6">Features</h3>
            <ul className="grid grid-cols-1 gap-2">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
                {car.transmission} Transmission
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
                {car.fuelType} Engine
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
                {car.bodyType} Body Style
              </li>
              {car.seats && (
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
                  {car.seats} Seats
                </li>
              )}
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
                {car.color} Exterior
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Specifications Section */}
      <div className="mt-8 p-6 bg-white rounded-lg shadow-sm">
        <h3 className="text-2xl font-bold mb-6">Specifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <span className="font-semibold w-32">Make:</span>
            <span>{car.make}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold w-32">Model:</span>
            <span>{car.model}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold w-32">Year:</span>
            <span>{car.year}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold w-32">Body Type:</span>
            <span>{car.bodyType}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold w-32">Fuel Type:</span>
            <span>{car.fuelType}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold w-32">Transmission:</span>
            <span>{car.transmission}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold w-32">Mileage:</span>
            <span>{car.mileage?.toLocaleString()} miles</span>
          </div>
          {car.seats && (
            <div className="flex items-center gap-3">
              <span className="font-semibold w-32">Seats:</span>
              <span>{car.seats}</span>
            </div>
          )}
          <div className="flex items-center gap-3">
            <span className="font-semibold w-32">Color:</span>
            <span>{car.color}</span>
          </div>
          {car.engine && (
            <div className="flex items-center gap-3">
              <span className="font-semibold w-32">Engine:</span>
              <span>{car.engine}</span>
            </div>
          )}
          {car.vin && (
            <div className="flex items-center gap-3">
              <span className="font-semibold w-32">VIN:</span>
              <span>{car.vin}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 p-6 bg-white rounded-lg shadow-sm">
        <h3 className="text-2xl font-bold mb-6">Dealership Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <span className="font-semibold">Name: </span>
            <span>{car.dealership?.name || "MotorAI Dealership"}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapIcon className="h-5 w-5 text-blue-600" />
            <span className="font-semibold">Address: </span>
            <span>{car.dealership?.address || "123 Main St, Your City"}</span>
          </div>
          <div>
            <span className="font-semibold">Phone: </span>
            <span>{car.dealership?.phone || "+1 234-567-8901"}</span>
          </div>
          <div>
            <span className="font-semibold">Email: </span>
            <span>{car.dealership?.email || "info@motorai.in"}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 p-6 bg-white rounded-lg shadow-sm">
        <h3 className="text-2xl font-bold mb-6">Dealership Working Hours</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(
            car.dealership?.workingHours || [
              { day: "Monday", open: "09:00", close: "18:00" },
              { day: "Tuesday", open: "09:00", close: "18:00" },
              { day: "Wednesday", open: "09:00", close: "18:00" },
              { day: "Thursday", open: "09:00", close: "18:00" },
              { day: "Friday", open: "09:00", close: "18:00" },
              { day: "Saturday", open: "10:00", close: "16:00" },
              { day: "Sunday", open: "Closed", close: "" },
            ]
          ).map((wh, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="font-semibold w-32">{wh.day}:</span>
              <span>
                {wh.open === "Closed" ? "Closed" : `${wh.open} - ${wh.close}`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
