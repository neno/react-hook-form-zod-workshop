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
      .nonempty('Username is required')
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
    message: 'May not use username as e-mail',
    path: ['userNameRefined'], // path of error
  });

export const MyForm = () => {
  const { register, handleSubmit, control, formState } = useForm({
    resolver: zodResolver(MyFormSchema),
  });
  const { errors } = formState;

  const submitHandler = () => {};

  console.log('ERRORS:', errors);

  return (
    <div className='w-1/2 my-16'>
      <form noValidate onSubmit={handleSubmit(submitHandler)}>
        <label>
          E-Mail
          <input type='text' {...register('email')} />
          {errors?.email && (
            <p className='error'>{(errors.email as FieldError).message}</p>
          )}
        </label>
        <label>
          UserName
          <input type='text' {...register('userName')} />
          {errors?.userName && (
            <p className='error'>{(errors.userName as FieldError).message}</p>
          )}
          {errors?.userNameRefined && (
            <p className='error'>
              {(errors.userNameRefined as FieldError).message}
            </p>
          )}
        </label>
        <label>
          Password
          <input type='password' {...register('password')} />
          {errors?.password && (
            <p className='error'>{(errors.password as FieldError).message}</p>
          )}
        </label>
        <label>
          Age
          <input type='number' {...register('age')} />
          {errors?.age && (
            <p className='error'>{(errors.age as FieldError).message}</p>
          )}
        </label>
        <button className='p-2 bg-purple-500 rounded' type='submit'>
          Submit
        </button>
      </form>
      <DevTool control={control} />
    </div>
  );
};
