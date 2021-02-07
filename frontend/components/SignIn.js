import { gql, useMutation } from '@apollo/client';
import Form from './styles/Form';
import useForm from '../lib/useForm';
import { CURRENT_USER_QUERY } from './User';
import Error from './ErrorMessage';

const SIGNIN_MUTATION = gql`
        mutation SIGNIN_MUTATION($email: String!, $password: String!) {
                authenticateUserWithPassword(email: $email, password: $password) {
                        ... on UserAuthenticationWithPasswordSuccess {
                                item {
                                        id
                                        email
                                        name
                                }
                        }
                        ... on UserAuthenticationWithPasswordSuccess {
                                code
                                message
                        }
                }
        }
`;

export default function SignIn() {
        const { inputs, handleChange, resetForm } = useForm({
                email: '',
                password: '',
        });
        const [signin, { data, loading }] = useMutation(SIGNIN_MUTATION, {
                variables: inputs,
                // refetch the currently logged in user
                refetchQueries: [{ query: CURRENT_USER_QUERY }],
        });
        async function handleSubmit(e) {
                e.preventDefault(); // stop the form from submitting
                console.log(inputs);
                const res = await Signin();
                console.log(res);
                // send the email and password to the graphQL API
        }
        const error =
                data?.authenticatedUserWithPassword.__typename === 'UserAuthenticatedWithPasswordFailure'
                        ? data?.authenticatedUserWithPassword
                        : undefined;
        return (
                <Form method="POST">
                        <h2> Sign In To Your Account</h2>
                        <Error error={error} />
                        <fieldset>
                                <label htmlFor="email">
                                        Email
                                        <input
                                                type="email"
                                                name="name"
                                                placeholder="Your email address"
                                                autoComplete="email"
                                                value={inputs.email}
                                                onChange={handleChange}
                                        />
                                </label>
                                <label htmlFor="password">
                                        Password
                                        <input
                                                type="password"
                                                password="password"
                                                placeholder="Your password"
                                                autoComplete="password"
                                                value={inputs.password}
                                                onChange={handleChange}
                                        />
                                </label>
                                <button type="submit">Sign in!</button>
                        </fieldset>
                </Form>
        );
}
