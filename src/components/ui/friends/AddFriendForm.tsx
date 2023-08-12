"use client"
import React, { useState } from "react";
import Button from "../Button";
import { cn } from "@/lib/utils";
import { addFriendValidator } from "@/lib/validations/add-friend";
import axios, { AxiosError } from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

type FormData = z.infer<typeof addFriendValidator>;

function AddFriendForm() {
  const [showSuccessState, setShowSuccessState] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(addFriendValidator),
  });

  const addFriend = async (email: string) => {
    try {
      const validatedEmail = addFriendValidator.parse({ email });
      await axios.post("/api/friends/add", { email: validatedEmail });
      setShowSuccessState(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError("email", { message: error.message });
        return;
      }

      if (error instanceof AxiosError) {
        setError("email", { message: error.response?.data });
        return;
      }

      setError("email", { message: "Something went wrong." });
    }
  };

  const onSubmit = (data: FormData) => {
    addFriend(data.email);
  };

  return (
    <form className="max-w-sm" onSubmit={handleSubmit(onSubmit)}>
      <label
        className="block
        text-sm text-gray-900 font-medium leading-6"
        htmlFor="email"
      >
        Add friend by email
      </label>

      <div className="mt-2 flex gap-4">
        <input
          {...register("email")}
          className={cn(`
          block w-full rounded-md
          border-0
          py-1.5
          text-gray-900
          shadow-sm
          ring-inset ring-gray-300
          placeholder:text-gray-400
          focus:ring-inset focus:ring-indigo-600 focus:ring-2
          sm:text-sm sm:leading-6`)}
          type="text"
          placeholder="you@example.com"
        />
        <Button>Add</Button>
      </div>
      <p className="mt-1 text-sm text-red-600">{errors.email?.message}</p>
      {showSuccessState ? (
        <p className="mt-1 text-sm text-green-600">Friend request sent!</p>
      ) : null}
    </form>
  );
}

export default AddFriendForm;
