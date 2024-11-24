import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
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
import { Input } from "@/components/ui/input";
import { DataContext } from "@/contexts/DataProvider";

const profileFormSchema = z.object({
  progressUpdate: z
    .array(
      z.object({
        value: z
          .string()
          .min(1, { message: "Please enter your progress update." }),
      })
    )
    .optional(),
  technicalChallenges: z
    .array(
      z.object({
        value: z
          .string()
          .min(1, { message: "Please enter your technical challenges." }),
      })
    )
    .optional(),
});

const CheckPointThree = () => {
  const navigate = useNavigate();
  const {
    setCheckpointThreeStatus,
    checkpointsCompleted,
    setCheckpointsCompleted,
  } = useContext(DataContext);
  const [formSubmitStatus, setFormSubmitStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState({
    status: "init",
    message: undefined,
  });

  const form = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      progressUpdate: [{ value: "" }, { value: "" }, { value: "" }],
      technicalChallenges: [{ value: "" }, { value: "" }, { value: "" }],
    },
    mode: "onChange",
  });

  const {
    fields: progressFields,
    append: appendProgress,
    remove: removeProgress,
  } = useFieldArray({
    name: "progressUpdate",
    control: form.control,
  });

  const {
    fields: challengeFields,
    append: appendChallenge,
    remove: removeChallenge,
  } = useFieldArray({
    name: "technicalChallenges",
    control: form.control,
  });

  useEffect(() => {
    async function getUserDetails() {
      try {
        const authResponse = await axios.get(`/api/user/auth`, {
          withCredentials: true,
        });
        const response = await axios.get("/api/user/start-time", {
          withCredentials: true,
        });
        const cp3Time = response?.data?.cp3Time;
        if (!cp3Time) navigate("/profile");
        if (cp3Time || cp3Time === null) {
          const currentTime = new Date().getTime();
          if (currentTime < new Date(cp3Time).getTime() || cp3Time === null) {
            navigate("/profile");
          }
        }
        const userData = authResponse.data.user;
        if (userData.checkpointsstatus.length < 2) {
          navigate("/checkpoint-1");
        }
        if (userData.checkpointsstatus[2] === true) {
          setFormSubmitStatus(true);
        }
        form.reset(userData.checkpointthree);
      } catch (error) {
        await axios.get("/api/user/logout", { withCredentials: true });
        navigate("/login");
        console.log(error);
      }
    }
    getUserDetails();
  }, []);

  async function onSubmit() {
    try {
      setLoading(true);
      const formData = form.getValues();
      const response = await axios.post(`/api/user/checkpoint-3`, formData, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setLoading(false);
        setFormSubmitStatus(true);
        setCheckpointThreeStatus(true);
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
      setLoading(false);
      console.log(error);
      if (error.response.data.errors?.length > 0) {
        const newErrors = {};
        error.response.data.errors.forEach((errorItem) => {
          newErrors[errorItem.path] = errorItem.msg;
        });
        setErrors(newErrors);
      } else if (error.response.status == 404) {
        setSubmitStatus({
          status: false,
          message:
            error.response.data.message ||
            "Error Submitting form. Try again later",
        });
        setTimeout(async () => {
          await axios.get("/api/user/logout", { withCredentials: true });
          navigate("/login");
        }, 2000);
      } else {
        setSubmitStatus({
          status: false,
          message:
            error.response.data.message ||
            "Error Submitting form. Try again later",
        });
      }

      setTimeout(() => {
        setSubmitStatus({
          status: "init",
          message: undefined,
        });
        setErrors({});
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
        // Count arrays only if they have non-empty values
        return value.some((item) => item.value.trim() !== "");
      }
      return value && value.trim() !== "";
    });
    return Math.round((filledFields.length / fields.length) * 100);
  };
  
    // Watch form values to update progress
    const watchedFields = form.watch();

  useEffect(() => {
    if (formSubmitStatus) {
      setProgress(100); // Set to full when the form is submitted
    } else {
      const progress = calculateProgress(watchedFields);
      setProgress(progress);
    }
  }, [watchedFields, formSubmitStatus]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#1E1E1E] rounded-xl  border border-[#E6EAF0] dark:border-[#343434]">
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className="bg-green-600 h-2 rounded-xl"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="p-5">
        <h1 className="font-semibold text-2xl mb-4 ">Checkpoint-3</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div>
              {challengeFields.map((field, index) => (
                <FormField
                  control={form.control}
                  key={field.id}
                  name={`technicalChallenges.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={cn("custom-label", index !== 0 && "sr-only")}
                      >
                        Technical Challenges:
                      </FormLabel>
                      <FormDescription className={cn(index !== 0 && "sr-only")}>
                        What technical challenges have you faced, and how are you
                        addressing them?
                      </FormDescription>
                      <FormControl>
                        <Input {...field} disabled={formSubmitStatus} />
                      </FormControl>
                      <div className="flex items-center space-x-2">
                        {/* Show the '-' button only on the last field if there are more than 3 fields */}
                        {challengeFields.length > 3 &&
                          index === challengeFields.length - 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="mt-2"
                              onClick={() => removeChallenge(index)}
                              disabled={formSubmitStatus}
                            >
                              -
                            </Button>
                          )}
                        {/* Always show the '+' button for adding new fields */}
                        {index === challengeFields.length - 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => appendChallenge({ value: "" })}
                            disabled={formSubmitStatus}
                          >
                            +
                          </Button>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
            {errors.technicalChallenges && (
              <p className="text-red-500">{errors.technicalChallenges}</p>
            )}
            <div>
              {progressFields.map((field, index) => (
                <FormField
                  control={form.control}
                  key={field.id}
                  name={`progressUpdate.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={cn("custom-label", index !== 0 && "sr-only")}
                      >
                        Progress Update:
                      </FormLabel>
                      <FormDescription className={cn(index !== 0 && "sr-only")}>
                        What progress have you made since the last checkpoint?
                      </FormDescription>
                      <FormControl>
                        <Input {...field} disabled={formSubmitStatus} />
                      </FormControl>
                      <div className="flex items-center space-x-2">
                        {/* Show the '-' button only on the last field if there are more than 3 fields */}
                        {progressFields.length > 3 &&
                          index === progressFields.length - 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="mt-2"
                              onClick={() => removeProgress(index)}
                              disabled={formSubmitStatus}
                            >
                              -
                            </Button>
                          )}
                        {/* Always show the '+' button for adding new fields */}
                        {index === progressFields.length - 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => appendProgress({ value: "" })}
                            disabled={formSubmitStatus}
                          >
                            +
                          </Button>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
            {errors.progressUpdate && (
              <p className="text-red-500">{errors.progressUpdate}</p>
            )}
            {/* {submitStatus && (
              <p className={`${submitStatus.status === true ? "text-green-500" : "text-red-500"}`}>
                {submitStatus.message}
              </p>
            )} */}
            {formSubmitStatus && !loading && (
              <p className="text-green-500">
                Checkpoint-3 Submitted successfully.
              </p>
            )}

            <Button
              className="bg-gray-700 hover:bg-gray-800 dark:bg-gray-200 dark:hover:bg-gray-300"
              type="submit"
              disabled={formSubmitStatus || loading}
            >
              {loading
                ? "Processing.."
                : formSubmitStatus
                ? "Submitted"
                : "Submit"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CheckPointThree;
