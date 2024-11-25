import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import useLoadingDots from "@/hooks/LoadingDots";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserProfile } from "../../features/ProfileSlice"; // Update the path as per your project structure

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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { CheckCircle, XCircle } from "lucide-react";
import {setCheckpointStatus, setCheckpointsCompleted} from "../../features/ProfileSlice"

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];

const FormSchema = z.object({
  primaryIdea: z
    .string()
    .min(10, {
      message: "PrimaryIdea must be at least 10 characters.",
    })
    .max(500, {
      message: "PrimaryIdea must not be longer than 500 characters.",
    }),
  role: z
    .string()
    .min(10, {
      message: "Role must be at least 10 characters.",
    })
    .max(500, {
      message: "Role must not be longer than 500 characters.",
    }),
  domainsWorkingOn: z.array(z.string()).refine((value) => value.length >= 3, {
    message: "You have to select at least three domains.",
  }),
  // file: z
  // .instanceof(File)
  // .superRefine((file, ctx) => {
  //   if (file.size > MAX_FILE_SIZE) {
  //     ctx.addIssue({
  //       code: z.ZodIssueCode.custom,
  //       message: "Max file size is 4MB.",
  //     });
  //   }
  //   if (!ALLOWED_FILE_TYPES.includes(file.type)) {
  //     ctx.addIssue({
  //       code: z.ZodIssueCode.custom,
  //       message: "Only JPEG, JPG, PNG, PDF, PPT, and PPTX files are allowed.",
  //     });
  //   }
  // })
  // .optional(),

  technologiesUsed: z
    .string()
    .min(2, {
      message: "Technologies Used must be at least 10 characters.",
    })
    .max(500, {
      message: "Technologies Used must not be longer than 500 characters.",
    }),
});

const domainsWorkingOn = [
  {
    id: "ai/ml",
    label: "Artificial Intelligence and Machine Learning",
  },
  {
    id: "web3",
    label: "Web3 Engineering (Blockchain)",
  },
  {
    id: "gai",
    label: "Generative AI",
  },
  {
    id: "iot",
    label: "Internet Of Things (IoT)",
  },
  {
    id: "algo/ds",
    label: "Algorithms and Data Structures",
  },
  {
    id: "ui",
    label: "Front-End (UI) Engineering",
  },
  {
    id: "cn/cyber",
    label: "Computer Networks & Cyber Security",
  },
  {
    id: "data-sys",
    label: "Database Systems",
  },
  {
    id: "vr/ar",
    label: "Virtual Reality and Augmented Reality",
  },
  {
    id: "robotics",
    label: "Robotics",
  },
  {
    id: "full-stack-web",
    label: "Full-Stack Web Development",
  },
  {
    id: "full-stack-mobile",
    label: "Full-Stack Mobile Development",
  },
  {
    id: "dev-ops",
    label: "DevOps Engineering",
  },
  {
    id: "software-testing",
    label: "Software Testing (QA)",
  },
  {
    id: "security-engineering",
    label: "Security Engineering",
  },
  {
    id: "data-engineering",
    label: "Data Engineering",
  },
  {
    id: "game-development",
    label: "Game Development",
  },
];

const CheckPointOne = () => {
  const dispatch = useDispatch();
const {checkpointsCompleted, checkpointsStatus} = useSelector((state) => state.profile)
  const [fileUploadStatus, setFileUploadStatus] = useState({
    status: "idle",
    message: "",
  });
  const navigate = useNavigate();
  const [fomSubmitStatus, setFormSubmitStatus] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    status: "init",
    message: undefined,
  });
  const [errors, setErrors] = useState({});

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      primaryIdea: "",
      role: "",
      domainsWorkingOn: [],
      technologiesUsed: "",
      file: "",
    },
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
        const cp1Time = response?.data?.cp1Time;
        if (!cp1Time) navigate("/profile");
        const userData = authResponse.data.user;
        if (userData?.checkpointone?.file) {
          userData.checkpointone.file = userData.checkpointone.file
            .split("-")
            .slice(1)
            .join("-");
          form.setValue("file", userData.checkpointone.file);
          setFileUploadStatus({
            status: "success",
            progress: 100,
            filename: userData.checkpointone.file,
            message: response.data.message || "File Uploaded Succesfully",
          });
        }

        if (cp1Time || cp1Time === null) {
          const currentTime = new Date().getTime();
          if (currentTime < new Date(cp1Time).getTime() || cp1Time === null) {
            navigate("/profile");
          }
        }

        if (userData.checkpointsstatus[0] === true) {
          setFormSubmitStatus(true);
        }

        form.reset(userData.checkpointone);
      } catch (error) {
        await axios.get("/api/user/logout", { withCredentials: true });
        navigate("/login");
        console.log(error);
      }
    }
    getUserDetails();
  }, []);

  const onFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size and type
    // if (file.size > MAX_FILE_SIZE) {
    //   setFileUploadStatus({ status: 'error', progress: 0, filename: '', message:"Please upload less than 4MB file." })
    //   return
    // }

    // if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    //   setFileUploadStatus({ status: 'error', progress: 0, filename: '', message:"Only JPEG, JPG, PNG, PDF, PPT, and PPTX files are allowed." })
    //   return
    // }

    try {
      const formData = new FormData();
      formData.append("file", file);

      setFileUploadStatus({
        status: "uploading",
        progress: 0,
        filename: file.name,
        message: "Uploading...",
      });

      const response = await axios.post("/api/user/upload-file", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setFileUploadStatus((prev) => ({
            ...prev,
            progress: percentCompleted,
          }));
        },
      });

      if (response.status === 200) {
        setFileUploadStatus({
          status: "success",
          progress: 100,
          filename: response.data.filename.split("-").slice(1).join("-"),
          message: response.data.message || "File Uploaded Succesfully",
        });
        form.setValue("file", response.data.filename);
      }
    } catch (error) {
      console.error(error);
      setFileUploadStatus({
        status: "error",
        progress: 0,
        filename: "",
        message:
          error.response.data.message ||
          "Error Uploading file please try again",
      });
    }
  };

  async function onSubmit(data) {
    try {
      setLoading(true);
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (typeof value === "object") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });
      // if (file) {
      //   formData.append("file", file);
      // }
      // for (let [key, value] of formData.entries()) {
      //   console.log(`${key}: ${value}`);
      // }

      const response = await axios.post(`/api/user/checkpoint-1`, formData, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setLoading(false);
        setFormSubmitStatus(true);
        dispatch(setCheckpointStatus({ index: 0, status: true })); ;
        // setCheckpointsStatus(Array.push(true));
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

  // Access Redux state
  const checkpointOneStatus = useSelector(
    (state) => state.profile.checkpointsStatus[0] // Fetch the first checkpoint's status
  );
  const loadingDots = useLoadingDots();

  useEffect(() => {
    // Fetch user profile data on component mount
    dispatch(fetchUserProfile());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#1E1E1E] rounded-xl p- border border-[#E6EAF0] dark:border-[#343434]">
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className="bg-green-600 h-2 rounded-xl"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="p-5">
      <div className="mb-4">
          <h3 className="text-xl md:text-2xl font-medium">
            Checkpoint - 1{" "}
            {loading ? (
              <span className="text-blue-500">Loading{loadingDots}</span>
            ) : checkpointOneStatus ? (
              <span className="text-[#52e500]">(Completed)</span>
            ) : (
              <span className="text-red-500">(Incomplete)</span>
            )}
          </h3>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="primaryIdea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="custom-label">
                    What is the primary idea or concept behind your hackathon
                    project?
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Primary idea or concept"
                      // className="resize-none"
                      {...field}
                      disabled={fomSubmitStatus}
                    />
                  </FormControl>
                  {/* <FormDescription>
                    You can <span>@mention</span> other users and organizations.
                  </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            {errors.primaryIdea && (
              <p className="text-red-500">{errors.primaryIdea}</p>
            )}

            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attach File (Optional)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        disabled={
                          fomSubmitStatus ||
                          fileUploadStatus.status === "success"
                        }
                        type="file"
                        onChange={onFileChange}
                        accept={ALLOWED_FILE_TYPES.join(",")}
                        className="pr-10"
                      />
                      {fileUploadStatus.status !== "idle" && (
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                          {fileUploadStatus.status === "uploading" && (
                            <div className="w-6 h-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                          )}
                          {fileUploadStatus.status === "success" && (
                            <CheckCircle className="w-6 h-6 text-green-500" />
                          )}
                          {fileUploadStatus.status === "error" && (
                            <XCircle className="w-6 h-6 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                  {fileUploadStatus.status === "uploading" && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${fileUploadStatus.progress}%` }}
                      ></div>
                    </div>
                  )}
                  {fileUploadStatus.status === "success" && (
                    <p className="text-green-500 mt-2">
                      {fileUploadStatus.filename +
                        " " +
                        fileUploadStatus.message || "File Uploadedsuccessfully"}
                    </p>
                  )}
                  {fileUploadStatus.status === "error" && (
                    <p className="text-red-500 mt-2">
                      {fileUploadStatus.message ||
                        "Error uploading file. Please try again."}
                    </p>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="custom-label">
                    Could you also describe your role during the hackathon?
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      type="text"
                      placeholder="Your role during the hackathon"
                      // className="resize-none"
                      {...field}
                      disabled={fomSubmitStatus}
                    />
                  </FormControl>
                  {/* <FormDescription>
                    You can <span>@mention</span> other users and organizations.
                  </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            {errors.role && <p className="text-red-500">{errors.role}</p>}
            <FormField
              control={form.control}
              name="domainsWorkingOn"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base custom-label">
                      Choose the relevant domains that you will be working on
                    </FormLabel>
                    <FormDescription>
                      Note : You can choose multiple domains. (Min 3)
                    </FormDescription>
                  </div>
                  {domainsWorkingOn.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="domainsWorkingOn"
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
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      );
                                }}
                                disabled={fomSubmitStatus}
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
            {errors.domainsWorkingOn && (
              <p className="text-red-500">{errors.domainsWorkingOn}</p>
            )}
            <FormField
              control={form.control}
              name="technologiesUsed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="custom-label">
                    Mention the Technologies/Frameworks being used during the
                    project?
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your technology and framework"
                      // className="resize-none"
                      {...field}
                      disabled={fomSubmitStatus}
                    />
                  </FormControl>
                  {/* <FormDescription>
                    You can <span>@mention</span> other users and organizations.
                  </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            {errors.technologiesUsed && (
              <p className="text-red-500">{errors.technologiesUsed}</p>
            )}

            {/* {submitStatus && (
              <p className={`${submitStatus.status === true ? "text-green-500" : "text-red-500"}`}>
                {submitStatus.message}
              </p>
            )} */}
            {fomSubmitStatus && !loading && (
              <p className="text-green-500">
                Checkpoint-1 Submitted successfully.
              </p>
            )}
            <Button
              className="bg-gray-700 hover:bg-gray-800 dark:bg-gray-200 dark:hover:bg-gray-300"
              type="submit"
              disabled={fomSubmitStatus || loading}
            >
              {loading
                ? "Processing.."
                : fomSubmitStatus
                ? "Submitted"
                : "Submit"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CheckPointOne;
