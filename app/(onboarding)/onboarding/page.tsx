'use client';

import LogoutButton from "@/components/auth/LogoutButton";
import UserGreetings from "@/components/dashboard/UserGreetings";
import AccountsStep from "@/components/onboarding/AccountsStep";
import PreferencesStep from "@/components/onboarding/PreferencesStep";
import { OnboardingFormValues, onboardingSchema } from "@/lib/validations/onboarding";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

const OnboardingPage = () => {
  const methods = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      languagePreference: "EN",
      spendLimit: 1000,
      currency: "INR",
      paymentMode: "",
      accounts: []
    },
  });

  const onSubmit = (data: OnboardingFormValues) => {
    console.log("Final Onboarding Data:", data);
  };

  return (
    <>
      <header className="flex justify-between">
        <UserGreetings />
        <LogoutButton />
      </header>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8 max-w-5xl mx-auto p-6">
          <PreferencesStep />
          <AccountsStep />
          {/* <CardsStep /> */}

          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg">
            Complete Onboarding
          </button>
        </form>
      </FormProvider>
    </>
  );
};

export default OnboardingPage;