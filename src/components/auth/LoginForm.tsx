"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import FormInput from "./FormInput";
import FormButton from "./FormButton";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginInput>>({});
  const [generalError, setGeneralError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setGeneralError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const validation = loginSchema.safeParse(data);

    if (!validation.success) {
      const fieldErrors: Partial<LoginInput> = {};
      validation.error.errors.forEach((err) => {
        const field = err.path[0] as keyof LoginInput;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setGeneralError("Email ou senha incorretos");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setGeneralError("Ocorreu um erro. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ duration: 0.2 }}
    >
      {generalError && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
          {generalError}
        </div>
      )}

      <FormInput
        label="Email"
        name="email"
        type="email"
        placeholder="seu@email.com"
        error={errors.email}
        autoComplete="email"
      />

      <div>
        <FormInput
          label="Senha"
          name="password"
          type="password"
          placeholder="Digite sua senha"
          error={errors.password}
          autoComplete="current-password"
        />
        <div className="mt-2 flex justify-end">
          <button
            type="button"
            className="text-xs text-moss-500 transition-colors hover:text-moss-400"
          >
            Esqueceu a senha?
          </button>
        </div>
      </div>

      <div className="mt-2">
        <FormButton type="submit" isLoading={isLoading}>
          Entrar
        </FormButton>
      </div>
    </motion.form>
  );
}
