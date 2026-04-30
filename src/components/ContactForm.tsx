import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Phone, Mail, User, Building, MessageSquare } from "lucide-react";
import { Hoarding } from "@/data/hoardings";
import { formatINR } from "@/utils/currency";
import { API_BASE_URL } from "@/config";

// Form validation schema
const inquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  company: z.string().optional(),
  message: z.string().min(10, "Please provide more details about your campaign"),
});

type InquiryFormData = z.infer<typeof inquirySchema>;

// GLOBAL ADMIN BLOCK - Never render ContactForm for admins
const GLOBAL_ADMIN_CHECK = () => {
  const isAdmin = window.location.pathname.startsWith('/admin') || localStorage.getItem('isAdmin') === 'true';
  console.log('GLOBAL_ADMIN_CHECK: isAdmin:', isAdmin, 'pathname:', window.location.pathname);
  return isAdmin;
};

// GLOBAL POPUP BLOCKER - Block any popup/modal in admin mode
const GLOBAL_POPUP_BLOCKER = (componentName: string) => {
  const isAdmin = GLOBAL_ADMIN_CHECK();
  if (isAdmin) {
    console.log(`GLOBAL_POPUP_BLOCKER: BLOCKED ${componentName} - Admin mode detected`);
    return true; // Block the component
  }
  return false; // Allow the component
};

interface ContactFormProps {
  hoarding: Hoarding | null;
  isOpen: boolean;
  onClose: () => void;
  selectedDates?: { startDate: string; endDate: string } | null;
}

export const ContactForm = ({ hoarding, isOpen, onClose, selectedDates }: ContactFormProps) => {
  // GLOBAL BLOCK - Never render for admin mode under any circumstances
  if (GLOBAL_POPUP_BLOCKER('ContactForm')) {
    return null;
  }
  
  if (!isOpen) {
    console.log('ContactForm: Not open, returning null');
    return null;
  }
  
  console.log('ContactForm: PASSING ALL CHECKS - Rendering contact form for hoarding:', hoarding?.title);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
  });

  const onSubmit = async (data: InquiryFormData) => {
    setIsSubmitting(true);
    try {
      // Submit inquiry to backend
      const response = await fetch(`${API_BASE_URL}/api/inquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          companyName: data.company, // Dual-mapping for backend compatibility
          hoardingId: hoarding?.id,
          hoardingTitle: hoarding?.title,
          hoardingLocation: hoarding?.location,
          hoardingPrice: hoarding?.price,
          hoardingPrintingCharges: hoarding?.printingCharges,
          hoardingMountingCharges: hoarding?.mountingCharges,
          hoardingTotalCharges: (hoarding?.price || 0) + (hoarding?.printingCharges || 0) + (hoarding?.mountingCharges || 0),
          selectedDates: selectedDates,
          submittedAt: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        reset();
      } else {
        throw new Error('Failed to submit inquiry');
      }
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      alert('Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setIsSubmitted(false);
    onClose();
  };

  if (isSubmitted) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="bg-kaki-dark-grey border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Thank You! 🎉
            </DialogTitle>
            <DialogDescription className="text-kaki-grey">
              Your inquiry has been submitted successfully. Our team will contact you within 24 hours.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">What happens next?</h4>
              <ul className="text-sm text-kaki-grey space-y-1">
                <li>• Our team will review your inquiry</li>
                <li>• You'll receive a detailed proposal</li>
                <li>• We'll schedule a call to discuss your campaign</li>
                <li>• Site visit and final quote preparation</li>
              </ul>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Need immediate assistance?</h4>
              <p className="text-sm text-kaki-grey mb-3">
                Call us directly at: <span className="text-purple-400 font-semibold">+91 98765 43210</span>
              </p>
              <p className="text-sm text-kaki-grey">
                Email: <span className="text-purple-400 font-semibold">advertising@kaki.com</span>
              </p>
            </div>
            
            <Button onClick={handleClose} className="w-full bg-purple-600 hover:bg-purple-700">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-kaki-dark-grey border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Inquiry Form
          </DialogTitle>
          <DialogDescription className="text-kaki-grey">
            Get a detailed quote for your advertising campaign
          </DialogDescription>
        </DialogHeader>

        {hoarding && (
          <div className="bg-white/5 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-white mb-2">Selected Hoarding</h4>
            <div className="text-sm text-kaki-grey space-y-1">
              <p><span className="text-white">Title:</span> {hoarding.title}</p>
              <p><span className="text-white">Location:</span> {hoarding.location}</p>
              <p><span className="text-white">Price:</span> {formatINR(hoarding.price)}/month</p>
              <p><span className="text-white">Size:</span> {hoarding.dimensions}</p>
              {selectedDates && (
                <div className="pt-2 border-t border-white/10">
                  <p><span className="text-white">Campaign Dates:</span></p>
                  <p className="text-purple-400">
                    {new Date(selectedDates.startDate).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })} - {new Date(selectedDates.endDate).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </p>
                  <p className="text-xs text-purple-300">
                    {Math.ceil((new Date(selectedDates.endDate).getTime() - new Date(selectedDates.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1} days
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white flex items-center gap-2">
              <User className="w-4 h-4" />
              Contact Information
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-kaki-grey mb-2">
                  Full Name *
                </label>
                <Input
                  {...register("name")}
                  placeholder="John Doe"
                  className="bg-black/40 border-white/10 text-white placeholder:text-kaki-grey/60"
                />
                {errors.name && (
                  <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-kaki-grey mb-2">
                  Email Address *
                </label>
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="john@example.com"
                  className="bg-black/40 border-white/10 text-white placeholder:text-kaki-grey/60"
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-kaki-grey mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number *
                </label>
                <Input
                  {...register("phone")}
                  placeholder="+91 98765 43210"
                  className="bg-black/40 border-white/10 text-white placeholder:text-kaki-grey/60"
                />
                {errors.phone && (
                  <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-kaki-grey mb-2 flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Company Name
                </label>
                <Input
                  {...register("company")}
                  placeholder="Your Company Ltd."
                  className="bg-black/40 border-white/10 text-white placeholder:text-kaki-grey/60"
                />
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-4 pt-4 border-t border-white/5">
            <h4 className="font-semibold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Campaign Requirements
            </h4>
            
            <div>
              <label className="block text-sm font-medium text-kaki-grey mb-2">
                Tell us about your campaign * (minimum 10 characters)
              </label>
              <Textarea
                {...register("message")}
                placeholder="Describe your campaign goals, target audience, creative requirements, and any specific needs..."
                className="bg-black/40 border-white/10 text-white placeholder:text-kaki-grey/60 min-h-[120px]"
              />
              {errors.message && (
                <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 border-white/10 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              {isSubmitting ? "Submitting..." : "Submit Inquiry"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
