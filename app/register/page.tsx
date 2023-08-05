'use client'
import LoginSignup from "../components/loginSignup/LoginSignup"
import { useRouter } from 'next/navigation';

const Register: React.FC = () => {
    const history = useRouter();
    const triggerPush = (href: string) => {
        history.replace(href)
    }
    return(
        <LoginSignup push={triggerPush}/>
    )
}
export default Register