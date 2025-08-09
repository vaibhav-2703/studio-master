
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function SlugRedirectPage() {
    const router = useRouter();
    const params = useParams();
    const alias = params.slug as string;
    const [status, setStatus] = useState<'loading' | 'found' | 'not_found'>('loading');
    const [destination, setDestination] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (alias) {
            fetch(`/api/redirect/${alias}`)
                .then(async (response) => {
                    if (response.ok) {
                        const data = await response.json();
                        setStatus('found');
                        setDestination(data.originalUrl);
                        // Using window.location.href for a full page reload to the external site
                        window.location.href = data.originalUrl;
                    } else if (response.status === 404) {
                        setStatus('not_found');
                    } else {
                        throw new Error('Failed to fetch link');
                    }
                })
                .catch(err => {
                    console.error(err);
                    setError('An error occurred while fetching the link.');
                    setStatus('not_found');
                });
        }
    }, [alias]);

    useEffect(() => {
        if (status === 'not_found') {
            const timer = setTimeout(() => {
                router.push('/');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [status, router]);

    // The redirect for 'found' status happens via window.location.href
    // This component will only render momentarily for "found" or permanently for "loading"/"not_found"
    return (
        <div className="flex flex-col min-h-screen items-center justify-center p-4 bg-background">
            <div className="text-center">
                {status === 'loading' && (
                    <>
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                        <h1 className="text-2xl font-bold mt-4">Redirecting...</h1>
                        <p className="text-muted-foreground">Please wait while we find your link.</p>
                    </>
                )}
                {status === 'found' && destination && (
                    <>
                        <h1 className="text-2xl font-bold mb-2">Redirecting you!</h1>
                        <p className="text-muted-foreground">If you are not redirected automatically, click the link below:</p>
                        <a href={destination} className="text-sm text-accent break-all mt-2 hover:underline">{destination}</a>
                    </>
                )}
                {status === 'not_found' && (
                     <div className="text-center">
                        <h1 className="text-2xl font-bold mb-2">Link Not Found</h1>
                        <p className="text-muted-foreground">The link with alias &quot;{alias}&quot; could not be found.</p>
                        {error && <p className="text-destructive mt-2">{error}</p>}
                        <p className="text-muted-foreground mt-4">You will be redirected to the homepage shortly.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
