'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';


import { routePath } from '../../core/constants/route-path';
import { signUpSchema } from '../validation/sign-up.schema';
import { SignUpRequest } from '../types/sign-up';
import { authServiceServer } from '../services/auth-service-server';
import styles from '../../../styles/AuthForms.module.css';

export function SignUpForm() {
  const { push } = useRouter();
  const [error, setError] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpRequest>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
  });

  const onSubmit = useCallback(async (data: SignUpRequest) => {
    const { error } = await authServiceServer.registerUser(data);

    if (error) return setError(error);

    push(routePath.login());
  }, [push]);

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authCard}>
        <h1 className={styles.authTitle}>Create Account</h1>

        {error && <p className={styles.errorText}>{error}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className={styles.formFields}>
          <Controller
            name="fullName"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                placeholder="Full Name"
                className={styles.inputField}
              />
            )}
          />
          {errors.fullName && <p className={styles.errorText}>{errors.fullName.message}</p>}

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="email"
                placeholder="Email"
                className={styles.inputField}
              />
            )}
          />
          {errors.email && <p className={styles.errorText}>{errors.email.message}</p>}

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="password"
                placeholder="Password"
                className={styles.inputField}
              />
            )}
          />
          {errors.password && <p className={styles.errorText}>{errors.password.message}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.submitButton}
          >
            {isSubmitting ? 'Creating...' : 'Sign Up'}
          </button>
        </form>

        <p className={styles.footerText}>
          Already have an account?{' '}
          <Link href={routePath.login()}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}