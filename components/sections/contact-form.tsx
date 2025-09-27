"use client";

import {useMemo, useState} from "react";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";

import {buildContactSchema, type ContactFormValues} from "@/lib/validation/contact";
import type {ContactFormContent, ContactFormField} from "@/types/landing";

type ContactFormProps = {
  form: ContactFormContent;
};

type SubmissionState = "idle" | "success" | "error";

export function ContactForm({form}: ContactFormProps) {
  const schema = useMemo(() => buildContactSchema(form.validation), [form.validation]);

  const {
    register,
    handleSubmit,
    reset,
    formState: {errors, isSubmitting},
  } = useForm<ContactFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      level: "",
      message: "",
    },
  });

  const [status, setStatus] = useState<SubmissionState>("idle");

  const onSubmit = handleSubmit(async (values) => {
    setStatus("idle");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      reset();
      setStatus("success");
    } catch (error) {
      console.error("[ContactForm] submission failed", error);
      setStatus("error");
    }
  });

  const renderField = (field: ContactFormField) => {
    const errorMessage = errors[field.id]?.message as string | undefined;
    const commonProps = {
      id: `contact-${field.id}`,
      "aria-invalid": Boolean(errorMessage) || undefined,
      "aria-describedby": errorMessage ? `contact-${field.id}-error` : undefined,
      className:
        "w-full rounded-full border border-secondary/30 bg-white/80 px-4 py-3 text-sm text-primary transition-colors duration-200 focus:border-primary focus:outline-none dark:border-surface/30 dark:bg-primary/30 dark:text-surface",
      placeholder: field.placeholder,
      required: field.required,
      ...register(field.id),
    };

    if (field.type === "textarea") {
      return (
        <textarea
          {...commonProps}
          className="w-full rounded-2xl border border-secondary/30 bg-white/80 px-3 py-3 text-sm text-primary transition-colors duration-200 focus:border-primary focus:outline-none dark:border-surface/30 dark:bg-primary/30 dark:text-surface"
          rows={4}
        />
      );
    }

    return (
      <input
        {...commonProps}
        type={field.type}
        inputMode={field.type === "tel" ? "tel" : undefined}
        autoComplete={mapAutocomplete(field.id)}
      />
    );
  };

  return (
    <form className="mt-6 flex flex-col gap-4" noValidate onSubmit={onSubmit}>
      {form.fields.map((field) => (
        <div key={field.id} className="flex flex-col gap-2 text-sm font-medium text-primary dark:text-surface">
          <label htmlFor={`contact-${field.id}`}>{field.label}</label>
          {renderField(field)}
          <p
            id={`contact-${field.id}-error`}
            role={errors[field.id] ? "alert" : undefined}
            className="min-h-[1.25rem] text-xs text-primary/80 dark:text-surface/80"
          >
            {errors[field.id]?.message as string | undefined}
          </p>
        </div>
      ))}

      <div className="rounded-2xl border border-secondary/20 bg-surface/70 px-4 py-3 text-xs text-secondary dark:border-surface/20 dark:bg-primary/30 dark:text-surface/80">
        {form.privacyNote}
      </div>

      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-surface transition-colors duration-200 ease-soft-sine focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent hover:bg-accent hover:text-primary disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isSubmitting}
      >
        {isSubmitting ? `${form.submitLabel}…` : form.submitLabel}
      </button>

      <div aria-live="polite" aria-atomic="true" className="h-5 text-xs font-medium">
        {status === "success" && <span className="text-primary dark:text-surface">{form.success}</span>}
        {status === "error" && <span className="text-secondary dark:text-surface/80">{form.error}</span>}
      </div>
    </form>
  );
}

function mapAutocomplete(fieldId: ContactFormField["id"]): string | undefined {
  switch (fieldId) {
    case "name":
      return "name";
    case "email":
      return "email";
    case "phone":
      return "tel";
    case "level":
      return "organization-title";
    case "message":
      return "off";
    default:
      return undefined;
  }
}