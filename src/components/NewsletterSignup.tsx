
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNewsletter } from "@/contexts/NewsletterContext";

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const { subscribe, isLoading } = useNewsletter();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    const success = await subscribe(email);
    if (success) {
      setSubmitted(true);
      setEmail("");
      
      // Reset the submitted state after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 w-full max-w-md">
      <div className="relative flex-grow">
        <Input
          type="email"
          placeholder="Seu melhor email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="pr-20 bg-background/10 backdrop-blur-sm border-muted text-white placeholder:text-gray-300"
          disabled={isLoading || submitted}
        />
        {submitted && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>
      <Button
        type="submit"
        className="bg-gold hover:bg-gold/90 text-white"
        disabled={isLoading || submitted}
      >
        {isLoading ? "Inscrevendo..." : "Inscrever-se"}
      </Button>
    </form>
  );
};

export default NewsletterSignup;
