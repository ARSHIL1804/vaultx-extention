import { AlertCircle } from "lucide-react"
 
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { string } from "zod"
 
export function AlertBox({variant, alertText, props}:any) {
  return (
    <Alert variant='default' className="bg-white bg-opacity-5 backdrop-blur-md border border-white border-opacity-10 rounded-lg p-4 flex items-center justify-between w-full hover:bg-white hover:bg-opacity-10 transition shadow-lg">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        {alertText}
      </AlertDescription>
    </Alert>
  )
}