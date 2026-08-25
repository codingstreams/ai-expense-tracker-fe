'use client';

import { onboardingService } from "@/services/onboarding.service";
import { LanguagePreferenceDto } from "@/types/onboarding.dto";
import { useEffect, useState } from "react";

const PreferencesStep = () => {
  const [langPrefs, setLangPrefs] = useState<LanguagePreferenceDto>();

  useEffect(()=>{
    onboardingService.getUserDetails()
    .then(langPrefs=>setLangPrefs(langPrefs));
  });

  return (
    <div>
      {/* <h2>Language Preferences</h2>
      <form action="">
        <select name="lang-preferences" id="langPreferences">
{langPrefs?.options.map((langPref, idx)=> <option key={idx} value={langPref}>{langPref}</option>)}
        </select>
        
      </form> */}
    </div>
  );
};

export default PreferencesStep;