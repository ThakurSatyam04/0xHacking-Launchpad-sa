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
  projectStage: z.enum(
    [
      "Planning and Design",
      "Initial Development",
      "Advanced Development",
      "Testing and Debugging",
    ],
    {
      required_error: "You need to select a project development stage.",
    }
  ),
  teamCollaboration: z.enum(
    [
      "All team members are actively contributing",
      "Some team members are not actively contributing",
      "Encountering team dynamics issues",
    ],
    {
      required_error: "You need to select a team collaboration status.",
    }
  ),
  mentorshipSupport: z.enum(
    [
      "Sufficient support received",
      "Need technical mentorship",
      "Need project management support",
    ],
    {
      required_error: "You need to select a mentorship and support status.",
    }
  ),
  timeline: z.enum(["On schedule", "Minor delays", "Significant delays"], {
    required_error: "You need to select a timeline status.",
  }),
  resources: z.enum(["Adequate resources", "Need additional tools/resources"], {
    required_error: "You need to select a resources and tools status.",
  }),
});

const CheckPointTwo = () => {
  const navigate = useNavigate();
  const {
    setCheckpointTwoStatus,
    checkpointsCompleted,
    setCheckpointsCompleted,
  } = useContext(DataContext);
  const [fomSubmitStatus, setFormSubmitStatus] = useState(false);
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [submitStatus, setSubmitStatus] = useState({
    status: "init",
    message: undefined,
  });

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      projectStage: "",
      teamCollaboration: "",
      mentorshipSupport: "",
      timeline: "",
      resources: "",
    },
  });

  useEffect(() => {
    async function getUserDetails() {
      try {
        const authResponse = await axios.get(`/api/user/auth`, { withCredentials: true });
        const response = await axios.get("/api/user/start-time", { withCredentials: true });
        const cp2Time = response?.data?.cp2Time;
        if (!cp2Time) navigate("/profile");
        if (cp2Time || cp2Time === null) {
          const currentTime = new Date().getTime();
          if (currentTime < new Date(cp2Time).getTime() || cp2Time === null) {
            navigate("/profile");
          }
        }
        const userData = authResponse.data.user;
        if (userData.checkpointsstatus.length < 1) {
          navigate("/checkpoint-1");
        }
        if (userData.checkpointsstatus[1] === true) {
          setFormSubmitStatus(true);
        }
        form.reset(userData.checkpointtwo); // Ensure data matches form structure
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
      const response = await axios.post(`/api/user/checkpoint-2`, formData, { withCredentials: true });
      if (response.status === 200) {
        setLoading(false)
        setFormSubmitStatus(true);
        setCheckpointTwoStatus(true);
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
    } catch (error) {
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
      <h1 className="font-semibold text-2xl mb-4 ">Checkpoint-2</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="projectStage"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="custom-label">
                  Choose Your Current Project Development Stage
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value} // Use value instead of defaultValue
                    className="flex flex-col space-y-2"
                    disabled={fomSubmitStatus}
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Planning and Design" />
                      </FormControl>
                      <FormLabel className="font-normal leading-relaxed">
                        Planning and Design: We are currently defining the
                        architecture and design of our project.
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Initial Development" />
                      </FormControl>
                      <FormLabel className="font-normal leading-relaxed">
                        Initial Development: We have begun coding and implementing
                        our initial designs.
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Advanced Development" />
                      </FormControl>
                      <FormLabel className="font-normal leading-relaxed">
                        Advanced Development: Our core functionalities are
                        developed, and we are adding additional features or
                        refining existing ones.
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Testing and Debugging" />
                      </FormControl>
                      <FormLabel className="font-normal leading-relaxed">
                        Testing and Debugging: We are in the testing phase,
                        identifying and fixing issues.
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {errors.projectStage && <p className="text-red-500">{errors.projectStage}</p>}
          <FormField
            control={form.control}
            name="teamCollaboration"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="custom-label">Team Collaboration</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-col space-y-1"
                    disabled={fomSubmitStatus}
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="All team members are actively contributing" />
                      </FormControl>
                      <FormLabel className="font-normal leading-relaxed">
                        All team members are actively contributing: Everyone is
                        engaged and contributing equally.
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Some team members are not actively contributing" />
                      </FormControl>
                      <FormLabel className="font-normal leading-relaxed">
                        Some team members are not actively contributing: A few
                        team members are less engaged.
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Encountering team dynamics issues" />
                      </FormControl>
                      <FormLabel className="font-normal leading-relaxed">
                        Encountering team dynamics issues: We are facing
                        challenges with team communication or collaboration.
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {errors.teamCollaboration && <p className="text-red-500">{errors.teamCollaboration}</p>}
          <FormField
            control={form.control}
            name="mentorshipSupport"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="custom-label">
                  Mentorship and Support
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-col space-y-1"
                    disabled={fomSubmitStatus}
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Sufficient support received" />
                      </FormControl>
                      <FormLabel className="font-normal leading-relaxed">
                        Sufficient support received: We have received adequate
                        guidance and resources.
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Need technical mentorship" />
                      </FormControl>
                      <FormLabel className="font-normal leading-relaxed">
                        Need technical mentorship: We require more in-depth
                        technical guidance.
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Need project management support" />
                      </FormControl>
                      <FormLabel className="font-normal leading-relaxed">
                        Need project management support: We need help with
                        managing our project or team dynamics.
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {errors.mentorshipSupport && <p className="text-red-500">{errors.mentorshipSupport}</p>}
          <FormField
            control={form.control}
            name="timeline"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="custom-label">
                  Are you on TimeLine ?
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-col space-y-1"
                    disabled={fomSubmitStatus}
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="On schedule" />
                      </FormControl>
                      <FormLabel className="font-normal leading-relaxed">
                        On schedule: We are on track to meet our planned
                        milestones.
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Minor delays" />
                      </FormControl>
                      <FormLabel className="font-normal leading-relaxed">
                        Minor delays: We are experiencing minor delays but can
                        catch up.
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Significant delays" />
                      </FormControl>
                      <FormLabel className="font-normal leading-relaxed">
                        Significant delays: We are significantly behind schedule
                        and may need additional support.
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {errors.timeline && <p className="text-red-500">{errors.timeline}</p>}
          <FormField
            control={form.control}
            name="resources"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="custom-label">
                  Resources and Tools
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-col space-y-1"
                    disabled={fomSubmitStatus}
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Adequate resources" />
                      </FormControl>
                      <FormLabel className="font-normal leading-relaxed">
                        Adequate resources: We have all the tools and resources we
                        need.
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Need additional tools/resources" />
                      </FormControl>
                      <FormLabel className="font-normal leading-relaxed">
                        Need additional tools/resources: We lack certain
                        tools/resources which are critical for progress.
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* {errors.resources && <p className="text-red-500">{errors.resources}</p>}
                  {submitStatus && (
            <p className={`${submitStatus.status === true ? "text-green-500" : "text-red-500"}`}>
              {submitStatus.message}
            </p>
          )} */}
          {(fomSubmitStatus && !loading) && <p className= "text-green-500">Checkpoint-2 Submitted successfully.</p>}
          <Button
            className="bg-gray-700 hover:bg-gray-800 dark:bg-gray-200 dark:hover:bg-gray-300"
            type="submit"
            disabled={fomSubmitStatus || loading}
          >
          {loading ? "Processing.." : fomSubmitStatus ? "Submitted" : "Submit"}
          </Button>
        </form>
      </Form>
      </div>
    </div>
  );
};

export default CheckPointTwo;
