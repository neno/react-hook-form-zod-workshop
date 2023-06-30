import { FieldError, useForm } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

type MyFormValues = {
  email: string;
  userName: string;
  password: string;
  age: number;
};

const MyFormSchema: z.ZodSchema<MyFormValues> = z
  .object({
    email: z.string().nonempty('E-Mail is required'),
    userName: z
      .string()
      .refine(
        (value) => value !== 'christian.hoeppner@pwc.com',
        'May not use myself'
      ),
    password: z
      .string()
      .includes('A', { message: 'Must contain an A' })
      .includes('B', { message: 'Must contain a B' }),
    age: z.coerce
      .number()
      .min(18, 'Must be 18 or older.')
      .max(32, 'Must be 32 or less'),
  })
  .refine((data) => data.userName !== data.email, {
    message: 'may not use username as e-mail',
    path: ['userName'], // path of error
  });

export const MyForm = () => {
  const { register, handleSubmit, control, formState } = useForm({
    resolver: zodResolver(MyFormSchema),
  });
  const { errors } = formState;

  const submitHandler = () => {};

  console.log('ERRORS:', errors);

  // errors.myCustomError

  return (
    <div>
      <form noValidate onSubmit={handleSubmit(submitHandler)}>
        <label>
          E-Mail
          <input type='text' {...register('email')} />
          {errors?.email && <p>{(errors.email as FieldError).message}</p>}
        </label>
        <label>
          UserName
          <input type='text' {...register('userName')} />
          {errors?.userName && <p>{(errors.userName as FieldError).message}</p>}
        </label>
        <label>
          Password
          <input type='password' {...register('password')} />
          {errors?.password && <p>{(errors.password as FieldError).message}</p>}
        </label>
        <label>
          Age
          <input type='number' {...register('age')} />
          {errors?.age && <p>{(errors.age as FieldError).message}</p>}
        </label>
        <button type='submit'>Submit</button>
      </form>
      <DevTool control={control} />
    </div>
  );
};
