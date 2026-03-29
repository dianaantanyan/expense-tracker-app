'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { signInSchema } from '../validation/sign-in.schema';
import { authService } from '../services/auth-service';
import { routePath } from '../../core/constants/route-path';
import { SignInRequest } from '../types/sign-in';

import styles from '../../../styles/AuthForms.module.css';

export function SignInForm() {
  const { push } = useRouter();
  const [error, setError] = useState('');

  const { handleSubmit, control, formState: { errors, isSubmitting } } = useForm<SignInRequest>({
    resolver: zodResolver(signInSchema),
    mode: 'onChange',
  });

  const onSubmit = useCallback(async (data: SignInRequest) => {
    const { error } = await authService.login(data);
    if (error) return setError(error);

    push(routePath.expenses());
  }, [push]);

  return (
    <div className={styles.authWrapper}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles.authCard}
      >
        <h1 className={styles.authTitle}>Sign In</h1>

        {error && <p className={styles.errorText}>{error}</p>}

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
        {errors.email && <p className={styles.errorText}>{errors.email?.message}</p>}

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
        {errors.password && <p className={styles.errorText}>{errors.password?.message}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className={styles.submitButton}
        >
          {isSubmitting ? 'Signing In...' : 'Sign In'}
        </button>

        <p className={styles.footerText}>
          Don't have an account?{' '}
          <Link href={routePath.register()}>
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}