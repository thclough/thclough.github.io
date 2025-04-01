"use server";

import React from "react";
import { Resend } from "resend";
import { validateString, getErrorMessage } from "@/lib/utils/utils";
import ContactFormEmail from "@/email/ContactFormEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (formData: FormData) => {
  const senderEmail = formData.get("senderEmail");
  const message = formData.get("message");

  console.log("Running on server");
  console.log(senderEmail);
  console.log(message);

  // simple server side validation

  if (!validateString(message, 500)) {
    return {
      error: "Invalid message",
    };
  }

  if (!validateString(senderEmail, 5000)) {
    return {
      error: "Invalid sender email",
    };
  }

  let data;
  try {
    await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>",
      to: "thclough@icloud.com",
      subject: "Message from contact form",
      reply_to: senderEmail as string,
      react: React.createElement(ContactFormEmail, {
        message: message as string,
      }),
    });
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }

  return {
    data,
  };
};
