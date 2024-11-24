import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";

import {
  fetchUserProfile,
  updateUserProfile,
  resetSubmitStatus,
} from "../../features/ProfileSlice"; // Adjust path as needed
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
import { Textarea } from "@/components/ui/textarea";

const profileFormSchema = z.object({
  bio: z.string().max(160).min(4),
  urls: z
    .array(
      z.object({
        value: z.string().url({ message: "Please enter a valid URL." }),
      })
    )
    .optional(),
  aboutProject: z.string().max(160).min(4),
});

const LaunchPadForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    profileData,
    userData,
    profileStatus,
    loading,
    submitStatus,
    error,
    location,
    buidlStatements,
  } = useSelector((state) => state.profile);
  console.log(location)

  const form = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      bio: "",
      urls: [{ value: "" }],
      aboutProject: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    // Fetch user profile data when the component mounts
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (userData) {
      form.setValue("bio", profileData?.bio || "");
      form.setValue("aboutProject", profileData?.aboutProject || "");
      form.setValue("urls", profileData?.urls || [{ value: "" }]);
    }
  }, [profileData, userData, form]);

  const { fields, append, remove } = useFieldArray({
    name: "urls",
    control: form.control,
  });

  const onSubmit = async () => {
    const formData = form.getValues();
    dispatch(updateUserProfile(formData));
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 dark:bg-[#1E1E1E]"
      >
        <div className="w-full flex justify-between text-gray-500 gap-5">
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
                      value={userData?.username || ""}
                      disabled
                      className="pl-10 rounded-xl" // Add padding to accommodate the icon
                    />
                  </div>
                </FormControl>
          </FormItem>
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
                      placeholder="John Doe"
                      value={userData?.fullname || ""}
                      disabled
                      className="pl-10 rounded-xl" // Add padding to accommodate the icon
                    />
                  </div>
                </FormControl>
          </FormItem>
        </div>
        <div className="w-full flex justify-between text-gray-500 gap-5">
          <FormItem className="flex-1">
            <FormLabel className="custom-label">Location</FormLabel>
            <FormControl>
              <div className="relative flex items-center">
                {/* Profile Icon */}
                <div className="absolute left-3 w-5 h-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#C7C9D9"
                    stroke-width="1"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-locate-fixed"
                  >
                    <line x1="2" x2="5" y1="12" y2="12" />
                    <line x1="19" x2="22" y1="12" y2="12" />
                    <line x1="12" x2="12" y1="2" y2="5" />
                    <line x1="12" x2="12" y1="19" y2="22" />
                    <circle cx="12" cy="12" r="7" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                {/* Input Field */}
                <Input
                  placeholder="Bangalore"
                  value={location.city || "Bangalore"}
                  disabled
                  className="pl-10 rounded-xl" // Add padding to accommodate the icon
                />
              </div>
            </FormControl>
          </FormItem>
          <FormItem className="flex-1">
            <FormLabel className="custom-label">BUIDL Statements</FormLabel>
            <FormControl>
              <div className="relative flex items-center">
                {/* Profile Icon */}
                <div className="absolute left-3 w-5 h-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#C7C9D9"
                    stroke-width="1"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-user"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                {/* Input Field */}
                <Input
                  placeholder="BUIDL statement"
                  value={buidlStatements || "BUIDL statement"}
                  disabled
                  className="pl-10 rounded-xl" // Add padding to accommodate the icon
                />
              </div>
            </FormControl>
          </FormItem>
        </div>
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="text-gray-500">
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
                <FormItem className="text-gray-500">
                  <FormLabel
                    className={cn("custom-label", index !== 0 && "sr-only")}
                  >
                    URLs
                  </FormLabel>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                    <FormControl className="flex-1">
                      <Input
                        disabled={profileStatus}
                        {...field}
                        placeholder="your links go here"
                        className="rounded-xl"
                      />
                    </FormControl>
                    <div className="flex gap-2 mt-2 sm:mt-0">
                      <Button
                        disabled={profileStatus || loading}
                        type="button"
                        variant="outline"
                        size="icon"
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
                          onClick={() => remove(index)}
                        >
                          -
                        </Button>
                      )}
                    </div>
                  </div>
                </FormItem>
              )}
            />
          ))}
        </div>
        <FormField
          control={form.control}
          name="aboutProject"
          render={({ field }) => (
            <FormItem className="text-gray-500">
              <FormLabel className="custom-label">
                Explain your Project in 2 lines
              </FormLabel>
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
        {submitStatus === "success" && (
          <p className="text-green-500">Profile updated successfully.</p>
        )}
        {error && <p className="text-red-500">{error}</p>}
        {profileStatus && <p className= "text-green-500">Profile updated successfully. <span className="animate-blink">Start hacking!</span></p>}
        <div className="flex gap-5 justify-end">
          <Button
            type="submit"
            size="lg"
            className="text-white bg-[#51AA83] hover:bg-[#06C270] dark:bg-[#51AA83] dark:hover:bg-[#06C270]"
            disabled={profileStatus || loading}
          >
            {loading ? "Processing.." : profileStatus ? "Submitted" : "Submit"}
          </Button>
          {profileStatus && (
            <Link to="/checkpoint-1">
              <Button className="text-white bg-[#51AA83] hover:bg-[#06C270] dark:bg-[#51AA83] dark:hover:bg-[#06C270]">
                Start Hacking!
              </Button>
            </Link>
          )}
        </div>
      </form>
    </Form>
  );
};

export default LaunchPadForm;
