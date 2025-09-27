"use client";

import * as Dialog from "@radix-ui/react-dialog";
import type {ComponentPropsWithoutRef, ElementRef} from "react";
import {forwardRef} from "react";

import {cn} from "@/lib/utils/cn";

type SheetProps = ComponentPropsWithoutRef<typeof Dialog.Root>;

export const Sheet = Dialog.Root;

export const SheetTrigger = Dialog.Trigger;

export const SheetClose = Dialog.Close;

export const SheetPortal = Dialog.Portal;

export const SheetOverlay = forwardRef<ElementRef<typeof Dialog.Overlay>, ComponentPropsWithoutRef<typeof Dialog.Overlay>>(
  ({className, ...props}, ref) => (
    <Dialog.Overlay
      ref={ref}
      className={cn("fixed inset-0 bg-primary/40 backdrop-blur-sm transition-opacity duration-200 ease-soft-sine data-[state=closed]:opacity-0 data-[state=open]:opacity-100", className)}
      {...props}
    />
  ),
);
SheetOverlay.displayName = Dialog.Overlay.displayName;

type SheetContentProps = ComponentPropsWithoutRef<typeof Dialog.Content>;

export const SheetContent = forwardRef<ElementRef<typeof Dialog.Content>, SheetContentProps>(
  ({className, children, ...props}, ref) => (
    <SheetPortal>
      <SheetOverlay />
      <Dialog.Content
        ref={ref}
        className={cn(
          "fixed inset-y-0 right-0 flex w-80 max-w-full flex-col gap-6 bg-surface p-6 text-primary shadow-sidebar outline-none transition-transform duration-200 ease-soft-sine data-[state=closed]:translate-x-full data-[state=open]:translate-x-0 dark:bg-primary dark:text-surface",
          className,
        )}
        {...props}
      >
        {children}
      </Dialog.Content>
    </SheetPortal>
  ),
);
SheetContent.displayName = Dialog.Content.displayName;