"use client"

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";

interface CourseEnrollButtonProps {
  price: number;
}

const CourseEnrollButton = ({
  price,
}: CourseEnrollButtonProps) => {
  
  return (
    <Button
      size="sm"
      className="w-full md-w-auto"
    >
      Enroll for {formatPrice(price)}
    </Button>
  )
}

export default CourseEnrollButton