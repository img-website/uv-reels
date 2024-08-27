import { cookies } from 'next/headers';

export function CheckTokenExpiration({ message }) {
    if (message === 'jwt expired' || message === 'jwt malformed' || message === 'invalid signature' || message === 'jwt must be provided') {
        // Get the cookies object
        const cookiesStore = cookies();
        
        // Clear the cookies
        cookiesStore.set('token', '', { path: '/', expires: new Date(0) });
        cookiesStore.set('userEmail', '', { path: '/', expires: new Date(0) });
        cookiesStore.set('userRole', '', { path: '/', expires: new Date(0) });

        console.log("Token has expired. Cookies have been removed.");
    }
}
