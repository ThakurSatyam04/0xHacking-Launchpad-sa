import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { DataContext } from "@/contexts/DataProvider";

const FormSchema = z.object({
  featureCompletion: z.enum(
    [
      "All key features implemented",
      "Most key features implemented",
      "Struggling with key features",
    ],
    {
      required_error: "You need to select a feature completion status.",
    }
  ),
  integrationTesting: z.enum(
    [
      "Integration complete",
      "Integration in progress",
      "Integration not started",
    ],
    {
      required_error:
        "You need to select an integration and system testing status.",
    }
  ),
  userExperience: z.enum(
    [
      "Finalized UX/UI",
      "UX/UI needs refinement",
      "UX/UI not addressed",
      "We got a hardware prototype",
    ],
    {
      required_error:
        "You need to select a user experience and interface status.",
    }
  ),
  qualityAssurance: z.enum(
    [
      "Comprehensive testing done",
      "Initial testing done",
      "Testing has not started",
    ],
    {
      required_error:
        "You need to select a testing and quality assurance status.",
    }
  ),
  presentationPreparation: z.enum(
    [
      "Presentation ready",
      "Working on presentation",
      "Presentation not started",
    ],
    {
      required_error:
        "You need to select a preparation for presentation status.",
    }
  ),
  teamReadiness: z.enum(
    [
      "Confident in our project",
      "Somewhat confident, need more rehearsal",
      "Not confident, need significant help",
    ],
    {
      required_error:
        "You need to select a team readiness and confidence status.",
    }
  ),
});

const CheckPointFour = () => {
  const navigate = useNavigate();
  const {
    setCheckpointFourStatus,
    checkpointsCompleted,
    setCheckpointsCompleted,
  } = useContext(DataContext);
  const [formSubmitStatus, setFormSubmitStatus] = useState(false);
  const [loading, setLoading] = useState(false)
  const[errors, setErrors ] = useState({})
  const [submitStatus, setSubmitStatus] = useState({
    status: "init",
    message: undefined,
  });

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      featureCompletion: "",
      integrationTesting: "",
      userExperience: "",
      qualityAssurance: "",
      presentationPreparation: "",
      teamReadiness: "",
    },
  });

  useEffect(() => {
    async function getUserDetails() {
      try {
        const authResponse = await axios.get(`/api/user/auth`, { withCredentials: true });
        const response = await axios.get("/api/user/start-time", { withCredentials: true });
        const cp4Time = response?.data?.cp4Time;
        if (!cp4Time) navigate("/profile");
        if (cp4Time || cp4Time === null) {
          const currentTime = new Date().getTime();
          if (currentTime < new Date(cp4Time).getTime() || cp4Time === null) {
            navigate("/profile");
          }
        }
        const userData = authResponse.data.user;
        if (userData.checkpointsstatus.length < 3) {
          navigate("/checkpoint-1");
        }
        if (userData.checkpointsstatus[3] === true) {
          setFormSubmitStatus(true);
        }

        form.reset(userData.checkpointfour);
      } catch (error) {
        await axios.get("/api/user/logout", {withCredentials:true});
        navigate("/login");
        console.log(error);
      }
    }
    getUserDetails();
  }, [form]);

  async function onSubmit() {
    try {
      setLoading(true)
      const formData = form.getValues();
      const response = await axios.post(`/api/user/checkpoint-4`, formData, { withCredentials: true });
      if (response.status === 200) {
        setLoading(false)
        setFormSubmitStatus(true);
        setCheckpointFourStatus(true);
        setCheckpointsCompleted(checkpointsCompleted + 1);
        setSubmitStatus({
          status: true,
          message: response.data.message,
        });
      }
      setTimeout(() => {
        setSubmitStatus({
          status: "init",
          message: undefined,
        });
      }, 3000);
    } catch (error)  {
      setLoading(false)
      console.log(error);
      if (error.response.data.errors?.length > 0) {
        const newErrors = {}; 
        error.response.data.errors.forEach((errorItem) => {
          newErrors[errorItem.path] = errorItem.msg;
        });
        setErrors(newErrors);
      }else if(error.response.status == 404){
        setSubmitStatus({
          status: false,
          message: error.response.data.message || "Error Submitting form. Try again later",
        });
        setTimeout(async () => {
          await axios.get("/api/user/logout", {withCredentials:true});
        navigate("/login");
        }, 2000);
      }
      else{
        setSubmitStatus({
          status: false,
          message: error.response.data.message || "Error Submitting form. Try again later",
        });

      }   

      setTimeout(() => {
        setSubmitStatus({
          status: "init",
          message: undefined,
        });
        setErrors({})
      }, 3000);
    }
  }

  const [progress, setProgress] = useState(0); // State to track progress
  // Function to calculate progress
  const calculateProgress = (formValues) => {
    const fields = Object.keys(formValues);
    const filledFields = fields.filter((field) => {
      const value = formValues[field];
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value && value.trim() !== "";
    });
    return Math.round((filledFields.length / fields.length) * 100);
  };

  // Watch form values to update progress
  const watchedFields = form.watch();
  useEffect(() => {
    const progress = calculateProgress(watchedFields);
    setProgress(progress);
  }, [watchedFields]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E6EAF0] dark:border-[#343434]">
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className="bg-green-600 h-2 rounded-xl"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="p-5">
      <h1 className="font-semibold text-2xl mb-4 ">Checkpoint-4</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="featureCompletion"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="custom-label">Feature Completion</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-col space-y-2"
                    disabled={formSubmitStatus}
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="All key features implemented" />
                      </FormControl>
                      <FormLabel className="font-normal leading-relaxed">
                        All key features implemented: All planned primary features
                        are fully implemented.
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Most key features implemented" />
                      </FormControl>
                      <FormLabel className="font-normal leading-relaxed">
                        Most key features implemented: Most of the main features
                        are done, but a few are still in progress.
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Struggling with key features" />
                      </FormControl>
                      <FormLabel className="font-normal leading-relaxed">
                        Struggling with key features: We are having difficulties
                        implementing several of the main features.
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {errors.featureCompletion && <p className="text-red-500">{errors.featureCompletion}</p>}
          <FormField
            control={form.control}
            name="integrationTesting"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="custom-label">
                  Integration and System Testing
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-col space-y-2"
                    disabled={formSubmitStatus}
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Integration complete" />
                      </FormControl>
                      <FormLabel className="font-normal leading-relaxed">
                        Integration complete: All components of our project have
                        been integrated and are functioning together.
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Integration in progress" />
                      </FormControl>
                      <FormLabel className="font-normal leading-relaxed">
                        Integration in progress: We are currently integrating our
                        project components.
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Integration not started" />
                      </FormControl>
                      <FormLabel className="font-normal leading-relaxed">
                        Integration not started: We have not started integrating
                        our project components yet.
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {errors.integrationTesting && <p className="text-red-500">{errors.integrationTesting}</p>}
          <FormField
            control={form.control}
            name="userExperience"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="custom-label">
                  User Experience and Interface
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-col space-y-2"
                    disabled={formSubmitStatus}
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Finalized UX/UI" />
                      </FormControl>
                      <FormLabel className="font-normal leading-relaxed">
                        Finalized UX/UI: Our user interface and user experience
                        designs are finalized and implemented.
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="UX/UI needs refinement" />
                      </FormControl>
                      <FormLabel className="font-normal leading-relaxed">
                        UX/UI needs refinement: Our user interface and user
                        experience designs require further refinement.
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="UX/UI not addressed" />
                      </FormControl>
                      <FormLabel className="font-normal leading-relaxed">
                        UX/UI not addressed: We have not adequately addressed user
                        interface or user experience issues.
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="We got a hardware prototype" />
                      </FormControl>
                      <FormLabel className="font-normal leading-relaxed">
                        We got a hardware prototype.
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {errors.userExperience && <p className="text-red-500">{errors.userExperience}</p>}
          <FormField
            control={form.control}
            name="qualityAssurance"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="custom-label">
                  Testing and Quality Assurance
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-col space-y-2"
                    disabled={formSubmitStatus}
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Comprehensive testing done" />
                      </FormControl>
                      <FormLabel className="font-normal leading-relaxed">
                        Comprehensive testing done: We have thoroughly tested our
                        project for bugs and performance issues.
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Initial testing done" />
                      </FormControl>
                      <FormLabel className="font-normal leading-relaxed">
                        Initial testing done: We have conducted some testing, but
                        more is needed.
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Testing has not started" />
                      </FormControl>
                      <FormLabel className="font-normal leading-relaxed">
                        Testing has not started: We have not started testing our
                        project yet.
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {errors.qualityAssurance && <p className="text-red-500">{errors.qualityAssurance}</p>}
          <FormField
            control={form.control}
            name="presentationPreparation"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="custom-label">
                  Preparation for Presentation
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-col space-y-2"
                    disabled={formSubmitStatus}
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Presentation ready" />
                      </FormControl>
                      <FormLabel className="font-normal leading-relaxed">
                        Presentation ready: Our presentation and demo are ready
                        for the final day.
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Working on presentation" />
                      </FormControl>
                      <FormLabel className="font-normal leading-relaxed">
                        Working on presentation: We are currently preparing our
                        presentation and demo.
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Presentation not started" />
                      </FormControl>
                      <FormLabel className="font-normal leading-relaxed">
                        Presentation not started: We have not started working on
                        our final presentation or demo yet.
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {errors.presentationPreparation && <p className="text-red-500">{errors.presentationPreparation}</p>}
          <FormField
            control={form.control}
            name="teamReadiness"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="custom-label">
                  Team Readiness and Confidence
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-col space-y-2"
                    disabled={formSubmitStatus}
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Confident in our project" />
                      </FormControl>
                      <FormLabel className="font-normal leading-relaxed">
                        Confident in our project: The team is confident and ready
                        to present.
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Somewhat confident, need more rehearsal" />
                      </FormControl>
                      <FormLabel className="font-normal leading-relaxed">
                        Somewhat confident, need more rehearsal: The team needs
                        more time to prepare to feel fully confident.
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Not confident, need significant help" />
                      </FormControl>
                      <FormLabel className="font-normal leading-relaxed">
                        Not confident, need significant help: The team is not
                        confident and requires substantial assistance.
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {errors.teamReadiness && <p className="text-red-500">{errors.teamReadiness}</p>}
          {/* {submitStatus && (
            <p className={`${submitStatus.status === true ? "text-green-500" : "text-red-500"}`}>
              {submitStatus.message}
            </p>
          )} */}
          {(formSubmitStatus && !loading) && <p className= "text-green-500">Checkpoint-4 Submitted successfully.</p>}
        
          <Button
            className="bg-gray-700 hover:bg-gray-800 dark:bg-gray-200 dark:hover:bg-gray-300"
            type="submit"
            disabled={formSubmitStatus || loading}
          >
          {loading ? "Processing.." : formSubmitStatus ? "Submitted" : "Submit"}
          </Button>
        </form>
      </Form>

      </div>
    </div>
  );
};

export default CheckPointFour;
