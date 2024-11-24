import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { Select } from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";

import { DataContext } from "@/contexts/DataProvider";

const profileFormSchema = z.object({
  bio: z.string().max(160).min(4),
  urls: z
  .array(
    z.object({
      value: z.string().url({ message: "Please enter a valid URL." }),
    })
  )
  .optional(),
  aboutProject: z.string().max(160).min(4), // check if present in backend or not
});

const LaunchPadForm = () => {
  const navigate = useNavigate();
  const { handleNext } = useContext(DataContext);
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [location, setLocation] = useState("");
  const [buidlStatements, setBuidlStatements] = useState("");
  const [email, setEmail] = useState("");
  const [profileStatus, setProfileStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    status: "init",
    message: undefined,
  });

  const form = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: "",
      fullname: "",
      location:"",
      buidlStatements:"",
      email: "",
      bio: "",
      urls: [{ value: "" }],
      aboutProject:""
    },
    mode: "onChange",
  });

  console.log(form)

  useEffect(() => {
    async function getUserDetails() {
      try {
        const authResponse = await axios.get(`/api/user/auth`, { withCredentials: true });
        const userData = authResponse.data.userData;
        const profileData = authResponse.data.user.profile;
        const profileSubmitStatus = authResponse.data.user.profileStatus;
        setProfileStatus(profileSubmitStatus);
        setUsername(userData.username);
        setFullname(userData.fullname);
        setLocation(userData.location);
        setBuidlStatements(userData.buidlStatements);
        setEmail(userData.email);
        form.setValue("username", userData.username);
        form.setValue("email", userData.email);
        form.setValue("fullname", userData.fullname);
        form.setValue("location", userData.location);
        form.setValue("buidlStatements", userData.buidlStatements);
        if (profileData) {
          form.setValue("bio", profileData.bio);
          form.setValue("aboutProject", profileData.aboutProject); // check if this field is in backend code or not and if there then what name
          form.setValue("urls", profileData.urls);
        }
      } catch (error) {
        await axios.get("/api/user/logout", {withCredentials:true});
        navigate("/login");
        console.log(error);
      }
    }
    getUserDetails();
  }, []);

  const { fields, append, remove } = useFieldArray({
    name: "urls",
    control: form.control,
  });

  async function onSubmit() {
    try {
      setLoading(true);
      const formData = form.getValues();
      const response = await axios.post(`/api/user/profile`, formData, { withCredentials: true });
      if (response.status === 200) {
        setSubmitStatus({ status: true, message: response.data.message });
        setProfileStatus(true);
        setLoading(false);
      } else {
        setLoading(false);
        setSubmitStatus({
          status: false,
          message: "Error Submitting form. Try again later",
        });
      }
      setTimeout(() => {
        setSubmitStatus({
          status: "init",
          message: undefined,
        });
      }, 3000);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setSubmitStatus({
        status: false,
        message: error.response.data.message || "Error Submitting form. Try again later",
      });

      setTimeout(() => {
        setSubmitStatus({
          status: "init",
          message: undefined,
        });
      }, 3000);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 dark:bg-[#1E1E1E]">
        <div className="w-full flex justify-between text-gray-500 gap-5">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="custom-label">Username</FormLabel>
                <FormControl>
                  <div className="relative flex items-center">
                    {/* Profile Icon */}
                    <div className="absolute left-3 w-5 h-5"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C7C9D9" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                    {/* Input Field */}
                    <Input
                      placeholder="Jinx_619"
                      value={username}
                      disabled
                      className="pl-10 rounded-xl" // Add padding to accommodate the icon
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fullname"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="custom-label">Full Name</FormLabel>
                <FormControl>
                  <div className="relative flex items-center">
                    {/* Profile Icon */}
                    <div className="absolute left-3 w-5 h-5"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C7C9D9" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                    {/* Input Field */}
                    <Input
                      placeholder="example@123.com"
                      value={fullname}
                      disabled
                      className="pl-10 rounded-xl" // Add padding to accommodate the icon
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-between text-gray-500 gap-5">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="custom-label">Location</FormLabel>
                <FormControl>
                  <div className="relative flex items-center">
                    {/* Profile Icon */}
                    <div className="absolute left-3 w-5 h-5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C7C9D9" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-locate-fixed"><line x1="2" x2="5" y1="12" y2="12"/><line x1="19" x2="22" y1="12" y2="12"/><line x1="12" x2="12" y1="2" y2="5"/><line x1="12" x2="12" y1="19" y2="22"/><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="3"/></svg>
                    </div>
                    {/* Input Field */}
                    <Input
                      placeholder="Bangalore"
                      value={location}
                      disabled
                      className="pl-10 rounded-xl" // Add padding to accommodate the icon
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="buidlStatements"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="custom-label">BUIDL Statements</FormLabel>
                <FormControl>
                  <div className="relative flex items-center">
                    {/* Profile Icon */}
                    <div className="absolute left-3 w-5 h-5"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C7C9D9" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                    {/* Input Field */}
                    <Input
                      placeholder="example@123.com"
                      value={buidlStatements}
                      disabled
                      className="pl-10 rounded-xl" // Add padding to accommodate the icon
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className='text-gray-500'>
              <FormLabel className="custom-label">Bio</FormLabel>
              <FormControl>
                <Textarea
                  disabled={profileStatus}
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none rounded-xl"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          {fields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`urls.${index}.value`}
              render={({ field }) => (
                <FormItem className='text-gray-500'>
                  <FormLabel
                    className={cn("custom-label", index !== 0 && "sr-only")}
                  >
                    URLs
                  </FormLabel>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                    <FormControl className="flex-1">
                      <Input disabled={profileStatus} {...field} placeholder="your links go here" className="rounded-xl"/>
                    </FormControl>
                    <div className="flex gap-2 mt-2 sm:mt-0">
                      <Button
                        disabled={profileStatus || loading}
                        type="button"
                        variant="outline"
                        size="icon"
                        className="text-green-500"
                        onClick={() => append({ value: "" })}
                      >
                        +
                      </Button>
                      {index !== 0 && (
                        <Button
                          disabled={profileStatus || loading}
                          type="button"
                          variant="outline"
                          size="icon"
                          className="text-red-500"
                          onClick={() => remove(index)}
                        >
                          -
                        </Button>
                      )}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        <FormField
          control={form.control}
          name="aboutProject"
          render={({ field }) => (
            <FormItem className='text-gray-500'>
              <FormLabel className="custom-label">Explain your Project in 2 lines</FormLabel>
              <FormControl>
                <Textarea
                  disabled={profileStatus}
                  placeholder="Tell us something interesting about your project"
                  className="resize-none rounded-xl"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

{profileStatus && <p className= "text-green-500">Profile updated successfully. <span className="animate-blink">Start hacking!</span></p>}
        {/* {submitStatus && (
          <p className={`${submitStatus.status === true ? "text-green-500" : "text-red-500"}`}>
            {submitStatus.message}
          </p>
        )} */}
        <div className="flex gap-5 justify-end">
          <Button
            type="submit"
            size="lg"
            className="text-white md:text-sm bg-[#51AA83] hover:bg-[#06C270] dark:bg-[#51AA83] dark:hover:bg-[#06C270] flex gap-1 items-center justify-center"
            disabled={profileStatus || loading}
          >
            {loading ? "Processing.." : profileStatus ? "Submitted" : "Submit"}
          </Button>
          {profileStatus && (
            <Link to="/checkpoint-1">
              <Button
                className="text-white md:text-sm bg-[#51AA83] hover:bg-[#06C270] dark:bg-[#51AA83] dark:hover:bg-[#06C270] flex gap-1 items-center justify-center"
              >
                Start Hacking! <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#ffffff" stroke="#ffffff" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zap"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>
              </Button>
            </Link>
          )}
          </div>
      </form>
    </Form>
  );
};

export default LaunchPadForm;
