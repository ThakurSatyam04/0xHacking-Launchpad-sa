import  {useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

import { useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { fetchUserProfile } from "@/features/ProfileSlice"; // Update the path as per your project structure
import {setCheckpointStatus, setCheckpointsCompleted} from "../../features/ProfileSlice"
import useLoadingDots from "@/hooks/LoadingDots";

const FormSchema = z.object({
  skillsInProject: z.array(z.string()).refine((value) => value.length >= 1, {
    message: "You have to select at least 1 skill.",
  }),
  otherSkillsInProject: z.string().optional(),
  skillsToLearn: z.array(z.string()).refine((value) => value.length >= 1, {
    message: "You have to select at least 1 learned skill.",
  }),
  otherSkillsToLearn: z.string().optional(),
  neededTools: z.array(z.string()).refine((value) => value.length >= 1, {
    message: "You have to select at least 1 tool.",
  }),
  otherNeededTools: z.string().optional(),
  challengesFaced: z.array(z.string()).refine((value) => value.length >= 1, {
    message: "You have to select at least 1 challenge.",
  }),
  otherChallengesFaced: z.string().optional(),
  additionalHelp: z.array(z.string()).refine((value) => value.length >= 1, {
    message: "You have to select at least 1 help.",
  }),
  otherAdditionalHelp: z.string().optional(),
});

const skillsInProject = [
  {
    id: "Basic Programming",
    label: "Basic Programming (e.g., Python, JavaScript)",
  },
  { id: "ml", label: "Machine Learning Basics" },
  { id: "Blockchain", label: "Understanding Blockchain" },
  { id: "Game Development", label: "Simple Game Development" },
  { id: "IoT", label: "Basic IoT (Internet of Things)" },
  { id: "UI/UX", label: "Designing Interfaces (UI/UX)" },
  { id: "Team Collaboration", label: "Team Collaboration" },
  { id: "Other", label: "Other" },
];

const skillsToLearn = [
  { id: "Programming", label: "Writing Code (Programming)" },
  { id: "AI", label: "How AI and Machine Learning Work" },
  { id: "BlockchainApps", label: "How to Create Blockchain Apps" },
  { id: "Games", label: "Making Simple Games" },
  { id: "IoT", label: "Connecting Devices (IoT)" },
  { id: "UI/UX", label: "Designing User-Friendly Interfaces" },
  { id: "TeamWork", label: "How to Work Better in a Team" },
  { id: "Other", label: "Other" },
];

const neededTools = [
  { id: "ExampleCode", label: "Example Code or Templates" },
  { id: "HardwareDevices", label: "Hardware Devices (e.g., sensors, boards)" },
  { id: "Guides", label: "Step-by-Step Guides or Tutorials" },
  { id: "Mentors", label: "Help from Mentors or Experts" },
  { id: "SoftwareTools", label: "Software Tools (e.g., IDEs, compilers)" },
  { id: "Other", label: "Other" },
];

const challengesFaced = [
  { id: "FixingErrors", label: "Fixing Errors in Code" },
  { id: "DataPreparation", label: "Preparing and Cleaning Data" },
  { id: "TechCombining", label: "Combining Different Technologies" },
  { id: "CreatingInterfaces", label: "Creating Interfaces" },
  { id: "TeamWorkChallenges", label: "Working Together as a Team" },
  { id: "Other", label: "Other" },
];

const additionalHelp = [
  { id: "Workshops", label: "More Workshops and Learning Sessions" },
  { id: "Mentors", label: "Access to Mentors for Help" },
  { id: "Training", label: "Training Sessions Before the Hackathon" },
  { id: "CollaborationTools", label: "Better Tools for Team Collaboration" },
  { id: "MoreTime", label: "More Time to Work on Projects" },
  { id: "Other", label: "Other" },
];

const CheckPointFive = () => {
  const dispatch = useDispatch();
  const {checkpointsCompleted} = useSelector((state) => state.profile)

  const navigate = useNavigate();
  const [formSubmitStatus, setFormSubmitStatus] = useState(false);
  const [showOtherInput, setShowOtherInput] = useState({
    domains: false,
    skills: false,
    tools: false,
    challenges: false,
    help: false,
  });

  const [loading, setLoading] = useState(false)
  const[errors, setErrors ] = useState({})
  const [submitStatus, setSubmitStatus] = useState({
    status: "init",
    message: undefined,
  });

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      skillsInProject: [],
      otherSkillsInProject: "",
      skillsToLearn: [],
      otherSkillsToLearn: "",
      neededTools: [],
      otherNeededTools: "",
      challengesFaced: [],
      otherChallengesFaced: "",
      additionalHelp: [],
      otherAdditionalHelp: "",
    },
  });

  useEffect(() => {
    async function getUserDetails() {
try {
  const authResponse = await axios.get(`/api/user/auth`, { withCredentials: true });
  const response = await axios.get("/api/user/start-time", { withCredentials: true });
  const cp5Time = response?.data?.cp5Time;
  if (!cp5Time) navigate("/profile");
  if (cp5Time || cp5Time === null) {
    const currentTime = new Date().getTime();
    if (currentTime < new Date(cp5Time).getTime() || cp5Time === null) {
      navigate("/profile");
    }
  }
  const userData = authResponse.data.user;
  if (userData.checkpointsstatus.length < 4) {
    navigate("/checkpoint-1");
  }
  if (userData.checkpointsstatus[4] === true) {
    setFormSubmitStatus(true);
  }
  form.reset(userData.checkpointfive);
} catch (error) {
  await axios.get("/api/user/logout", {withCredentials:true});
  navigate("/login");
  console.log(error);
}
    }
    getUserDetails();
  }, []);

  async function onSubmit() {
    try {
      setLoading(true)
      const formData = form.getValues();
      const response = await axios.post(`/api/user/checkpoint-5`, formData, { withCredentials: true });
      if (response.status === 200) {
        setLoading(false)
        setFormSubmitStatus(true);
        dispatch(setCheckpointStatus({ index: 2, status: true })); 
        dispatch(setCheckpointsCompleted(checkpointsCompleted + 1));
        setSubmitStatus({
          status: true,
          message: response.data.message,
        });
        window.location.reload();
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
    const halfLength = Math.ceil(fields.length / 2); // Get half of the form fields
    const filledFields = fields.filter((field) => {
      const value = formValues[field];
      if (Array.isArray(value)) {
        return value.length > 0; // Array fields should have at least one value
      }
      return value && value.trim() !== ""; // String fields should not be empty
    });
  
    // If half or more of the fields are filled, consider it 100% progress
    const progress = Math.min(
      Math.round((filledFields.length / halfLength) * 100), 
      100
    ); // Cap the progress at 100%
    
    return progress;
  };
  
  // Watch form values to update progress
  const watchedFields = form.watch();
  useEffect(() => {
    const progress = calculateProgress(watchedFields);
    setProgress(progress);
  }, [watchedFields]);

  const checkpointFiveStatus = useSelector(
    (state) => state.profile.checkpointsStatus[4] // Fetch the fifth checkpoint's status
  );
  const loadingDots = useLoadingDots();

  useEffect(() => {
    // Fetch user profile data on component mount
    dispatch(fetchUserProfile());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E6EAF0] dark:border-[#343434]">
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className="bg-green-600 h-2 rounded-xl"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="p-5">
      <div className="mb-4">
          <h3 className="text-xl md:text-2xl font-medium">
            Checkpoint - 5{" "}
            {loading ? (
              <span className="text-blue-500">Loading{loadingDots}</span>
            ) : checkpointFiveStatus ? (
              <span className="text-[#52e500]">(Completed)</span>
            ) : (
              <span className="text-red-500">(Incomplete)</span>
            )}
          </h3>
          {/* <p className="text-sm text-muted-foreground">
            26th May 2024 07:55
          </p> */}
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Domains Working On */}
            <FormField
              control={form.control}
              name="skillsInProject"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base custom-label">
                      Which skills did you find most helpful during the hackathon?
                    </FormLabel>
                    <FormDescription>(Check all that apply)</FormDescription>
                  </div>
                  {skillsInProject.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="skillsInProject"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  if (item.id === "Other") {
                                    setShowOtherInput((prev) => ({
                                      ...prev,
                                      domains: checked,
                                    }));
                                  }
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      );
                                }}
                                disabled={formSubmitStatus}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
              {errors.skillsInProject && <p className="text-red-500">{errors.skillsInProject}</p>}
              
            {showOtherInput.domains && (
              <FormField
                control={form.control}
                name="otherSkillsInProject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Please specify:</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {errors.otherSkillsInProject && <p className="text-red-500">{errors.otherSkillsInProject}</p>}

            {/* Skills to Learn */}
            <FormField
              control={form.control}
              name="skillsToLearn"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base custom-label">
                      What skills do you wish you had more knowledge about?
                    </FormLabel>
                    <FormDescription>(Check all that apply)</FormDescription>
                  </div>
                  {skillsToLearn.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="skillsToLearn"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  if (item.id === "Other") {
                                    setShowOtherInput((prev) => ({
                                      ...prev,
                                      skills: checked,
                                    }));
                                  }
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      );
                                }}
                                disabled={formSubmitStatus}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
            {errors.skillsToLearn && <p className="text-red-500">{errors.skillsToLearn}</p>}
            {showOtherInput.skills && (
              <FormField
                control={form.control}
                name="otherSkillsToLearn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Please specify:</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
                  {errors.otherSkillsToLearn && <p className="text-red-500">{errors.otherSkillsToLearn}</p>}

            {/* Needed Tools */}
            <FormField
              control={form.control}
              name="neededTools"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base custom-label">
                      Were there any tools or resources you felt you needed but
                      didn’t have?
                    </FormLabel>
                    <FormDescription>(Check all that apply)</FormDescription>
                  </div>
                  {neededTools.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="neededTools"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  if (item.id === "Other") {
                                    setShowOtherInput((prev) => ({
                                      ...prev,
                                      tools: checked,
                                    }));
                                  }
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      );
                                }}
                                disabled={formSubmitStatus}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
            {errors.neededTools && <p className="text-red-500">{errors.neededTools}</p>}
            {showOtherInput.tools && (
              <FormField
                control={form.control}
                name="otherNeededTools"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Please specify:</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

    {errors.otherNeededTools && <p className="text-red-500">{errors.otherNeededTools}</p>}

            {/* Challenges Faced */}
            <FormField
              control={form.control}
              name="challengesFaced"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base custom-label">
                      Did you face any challenges because you didn’t know how to do
                      something?
                    </FormLabel>
                    <FormDescription>(Check all that apply)</FormDescription>
                  </div>
                  {challengesFaced.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="challengesFaced"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  if (item.id === "Other") {
                                    setShowOtherInput((prev) => ({
                                      ...prev,
                                      challenges: checked,
                                    }));
                                  }
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      );
                                }}
                                disabled={formSubmitStatus}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
            {errors.challengesFaced && <p className="text-red-500">{errors.challengesFaced}</p>}
            {showOtherInput.challenges && (
              <FormField
                control={form.control}
                name="otherChallengesFaced"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Please specify:</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
      {errors.otherChallengesFaced && <p className="text-red-500">{errors.otherChallengesFaced}</p>}
            {/* Additional Help */}
            <FormField
              control={form.control}
              name="additionalHelp"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base custom-label">
                      What additional help or resources would have made your
                      experience better?
                    </FormLabel>
                    <FormDescription>(Check all that apply)</FormDescription>
                  </div>
                  {additionalHelp.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="additionalHelp"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  if (item.id === "Other") {
                                    setShowOtherInput((prev) => ({
                                      ...prev,
                                      help: checked,
                                    }));
                                  }
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      );
                                }}
                                disabled={formSubmitStatus}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
              {errors.additionalHelp && <p className="text-red-500">{errors.additionalHelp}</p>}
            {showOtherInput.help && (
              <FormField
                control={form.control}
                name="otherAdditionalHelp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Please specify:</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {errors.otherAdditionalHelp && <p className="text-red-500">{errors.otherAdditionalHelp}</p>}

    {/* {submitStatus && (
              <p className={`${submitStatus.status === true ? "text-green-500" : "text-red-500"}`}>
                {submitStatus.message}
              </p>
            )} */}
            {(formSubmitStatus && !loading) && <p className= "text-green-500">Checkpoint-5 Submitted successfully.</p>}
          

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

export default CheckPointFive;
