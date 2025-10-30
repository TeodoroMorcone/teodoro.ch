"use client";

import * as Dialog from "@radix-ui/react-dialog";
import {VisuallyHidden} from "@radix-ui/react-visually-hidden";
import type {ComponentPropsWithoutRef, ElementRef, ReactNode} from "react";
import {forwardRef, useId} from "react";

import {cn} from "@/lib/utils/cn";

type SheetProps = ComponentPropsWithoutRef<typeof Dialog.Root>;

export const Sheet = Dialog.Root;

export const SheetTrigger = Dialog.Trigger;

export const SheetClose = Dialog.Close;

export const SheetPortal = Dialog.Portal;

export const SheetTitle = Dialog.Title;

export const SheetDescription = Dialog.Description;

export const SheetOverlay = forwardRef<ElementRef<typeof Dialog.Overlay>, ComponentPropsWithoutRef<typeof Dialog.Overlay>>(
  ({className, ...props}, ref) => (
    <Dialog.Overlay
      ref={ref}
      className={cn("fixed inset-0 z-50 bg-primary/40 backdrop-blur-sm transition-opacity duration-200 ease-soft-sine data-[state=closed]:opacity-0 data-[state=open]:opacity-100", className)}
      {...props}
    />
  ),
);
SheetOverlay.displayName = Dialog.Overlay.displayName;

type SheetContentProps = ComponentPropsWithoutRef<typeof Dialog.Content> & {
  title?: ReactNode;
  description?: ReactNode;
  titleId?: string;
  descriptionId?: string;
  hideTitleVisually?: boolean;
  hideDescriptionVisually?: boolean;
  titleClassName?: string;
  descriptionClassName?: string;
};

export const SheetContent = forwardRef<ElementRef<typeof Dialog.Content>, SheetContentProps>(
  (
    {
      className,
      children,
      title,
      description,
      titleId: providedTitleId,
      descriptionId: providedDescriptionId,
      hideTitleVisually = true,
      hideDescriptionVisually = true,
      titleClassName,
      descriptionClassName,
      "aria-labelledby": ariaLabelledByProp,
      "aria-describedby": ariaDescribedByProp,
      ...rest
    },
    ref,
  ) => {
    const baseId = useId().replace(/:/g, "");
    const fallbackTitleId = providedTitleId ?? `sheet-${baseId}-title`;
    const fallbackDescriptionId = providedDescriptionId ?? `sheet-${baseId}-description`;

    const ariaLabelledBy = ariaLabelledByProp ?? (title ? fallbackTitleId : undefined);
    const ariaDescribedBy = ariaDescribedByProp ?? (description ? fallbackDescriptionId : undefined);

    return (
      <SheetPortal>
        <SheetOverlay />
        <Dialog.Content
          ref={ref}
          className={cn(
            "fixed inset-y-0 right-0 z-50 flex w-80 max-w-full flex-col gap-6 bg-surface p-6 text-primary shadow-sidebar outline-none transition-transform duration-200 ease-soft-sine data-[state=closed]:translate-x-full data-[state=open]:translate-x-0 dark:bg-primary dark:text-surface",
            className,
          )}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          {...rest}
        >
          {title ? (
            <Dialog.Title asChild>
              {hideTitleVisually ? (
                <VisuallyHidden id={fallbackTitleId}>{title}</VisuallyHidden>
              ) : (
                <span id={fallbackTitleId} className={titleClassName}>
                  {title}
                </span>
              )}
            </Dialog.Title>
          ) : null}
          {description ? (
            <Dialog.Description asChild>
              {hideDescriptionVisually ? (
                <VisuallyHidden id={fallbackDescriptionId}>{description}</VisuallyHidden>
              ) : (
                <p id={fallbackDescriptionId} className={descriptionClassName}>
                  {description}
                </p>
              )}
            </Dialog.Description>
          ) : null}
          {children}
        </Dialog.Content>
      </SheetPortal>
    );
  },
);
SheetContent.displayName = Dialog.Content.displayName;