import {
  LucideEye,
  LucideEyeOff,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import { isNullOrUndefined } from "@/lib/utils";
import { APP_CONTANTS } from "@/lib/constants";
import { useAuth } from "@/providers/AuthProvider";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
export default function CreatePassword() {
  const [showKey, setShowKey] = useState(false);
  const [passwords , setPasswords] = useState({
    password:"",
    confirmPassword:""
  })
  const [passwordsError , setPasswordsError] = useState({
    passwordError:"",
    confirmPasswordError:""
  })
  const {createPassword} = useAuth();
  const {t:translate} = useTranslation();


  const handleChange = (e)=>{
    setPasswords({
      ...passwords,
      [e.target.name]:e.target.value
    })
  }


  const validatePassword = ()=> {
    if(passwords.password.length < APP_CONTANTS.MIN_PASSWORD_LENGTH){
      setPasswordsError({
        passwordError: translate('password-short'),
        confirmPasswordError:""
      })
      return false;
    }
    else if(passwords.password.length > APP_CONTANTS.MAX_PASSWORD_LENGTH){
      setPasswordsError({
        passwordError: translate('password-long'),
        confirmPasswordError:""

      })
      return false;
    }
    else if(passwords.password != passwords.confirmPassword){
      setPasswordsError({
        passwordError:'',
        confirmPasswordError:translate('password-dont-match') 
      }) 
      return false;
    }
    setPasswordsError({
      passwordError:'',
      confirmPasswordError:''
    }) 
    return true;
  }

  const createNewPassword =  () =>{
    if(validatePassword()){
      createPassword(passwords.password)
    }
  }

  return (
    <div className="w-full h-full flex flex-col flex-1 py-4">
      <Header title="Create Password" hideBack={true}/>
      <div className="w-full flex flex-col justify-between bg-white bg-opacity-5 backdrop-blur-md border border-white border-opacity-10 rounded-lg p-4 shadow-lg">
        <div>
          <Label className="text-sm">{translate('password')}</Label>
          <div className="flex items-center relative mt-2">
            {showKey ? (
              <LucideEye
                className=" absolute right-3 top-6 transform -translate-y-1/2 cursor-pointer"
                size={22}
                onClick={() => setShowKey(false)}
              />
            ) : (
              <LucideEyeOff
                className="absolute right-3 top-6 transform -translate-y-1/2 cursor-pointer"
                size={22}
                onClick={() => setShowKey(true)}
              />
            )}
            <Input
              placeholder={translate('enter-password')}
              type={showKey ? "text" : "password"}
              className="text-md border-2 h-[48px] pr-10 focus:border-primary"
              name="password"
              onChange={handleChange}
            />
          </div>
          <span className="mt-2 text-sm text-destructive">{passwordsError.passwordError}</span>

        </div>
        <div className="mt-2">
          <Label className="text-sm">{translate('confirm-password')}</Label>
          <div className="flex items-center relative mt-2">
            {showKey ? (
              <LucideEye
                className=" absolute right-3 top-6 transform -translate-y-1/2 cursor-pointer"
                size={22}
                onClick={() => setShowKey(false)}
              />
            ) : (
              <LucideEyeOff
                className="absolute right-3 top-6 transform -translate-y-1/2 cursor-pointer"
                size={22}
                onClick={() => setShowKey(true)}
              />
            )}
            <Input
              placeholder={translate('enter-password-again')}
              type={showKey ? "text" : "password"}
              className="text-md border-2 h-[48px] pr-10 focus:border-primary"
              name="confirmPassword"
              onChange={handleChange}
            />
          </div>
          <span className="mt-2 text-sm text-destructive">{passwordsError.confirmPasswordError}</span>

        </div>
        <Button className="py-6 mt-4" onClick={createNewPassword}> {translate('create-password')} </Button>
      </div>
    </div>
  );
}
