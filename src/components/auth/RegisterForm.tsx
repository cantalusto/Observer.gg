"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import FormInput from "./FormInput";
import FormButton from "./FormButton";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";

interface RegisterFormProps {
  onSuccess?: () => void;
}

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<RegisterInput>>({});
  const [generalError, setGeneralError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setGeneralError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    };

    const validation = registerSchema.safeParse(data);

    if (!validation.success) {
      const fieldErrors: Partial<RegisterInput> = {};
      validation.error.issues.forEach((err) => {
        const field = err.path[0] as keyof RegisterInput;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
          },
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          setGeneralError("Este email já está cadastrado");
        } else {
          setGeneralError(error.message);
        }
        return;
      }

      onSuccess?.();
      router.push("/");
      router.refresh();
    } catch {
      setGeneralError("Ocorreu um erro. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
    >
      {generalError && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
          {generalError}
        </div>
      )}

      <FormInput
        label="Nome"
        name="name"
        type="text"
        placeholder="Como quer ser chamado"
        error={errors.name}
        autoComplete="name"
      />

      <FormInput
        label="Email"
        name="email"
        type="email"
        placeholder="seu@email.com"
        error={errors.email}
        autoComplete="email"
      />

      <FormInput
        label="Senha"
        name="password"
        type="password"
        placeholder="Min. 8 caracteres"
        error={errors.password}
        autoComplete="new-password"
      />

      <FormInput
        label="Confirmar senha"
        name="confirmPassword"
        type="password"
        placeholder="Repita a senha"
        error={errors.confirmPassword}
        autoComplete="new-password"
      />

      <div className="mt-2">
        <FormButton type="submit" isLoading={isLoading}>
          Criar conta
        </FormButton>
      </div>

      <p className="text-center text-[11px] leading-relaxed text-moss-600">
        Ao criar uma conta, você concorda com os{" "}
        <a href="#" className="text-moss-500 hover:text-moss-400 underline underline-offset-2">
          Termos de Uso
        </a>{" "}
        e{" "}
        <a href="#" className="text-moss-500 hover:text-moss-400 underline underline-offset-2">
          Privacidade
        </a>
      </p>
    </motion.form>
  );
}
