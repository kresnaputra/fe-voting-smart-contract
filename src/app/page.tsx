'use client';

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"

import { useEthersStore } from "@/store/ethers-store";
import CandidateCard, { Candidate } from "@/components/Candidate";
import { useRouter } from "next/navigation";
import { CONTRACT_ADDRESS_VOTING, contractABIVoting, getInformation } from "@/lib/utils";

export default function Home() {
  const { signer, provider, setBalance } = useEthersStore();

  const router = useRouter();

  const [showForm, setShowForm] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const checkIsOwner = async () => {
    const contract = new ethers.Contract(CONTRACT_ADDRESS_VOTING, contractABIVoting, signer);
    const isOwner = await contract.checkIsOnwer();
    setIsOwner(isOwner);
  }

  const checkHasVoted = async () => {
    const contract = new ethers.Contract(CONTRACT_ADDRESS_VOTING, contractABIVoting, signer);
    const hasVoted = await contract.checkHasVoted();
    setHasVoted(hasVoted);
  }

  const createCandidate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS_VOTING, contractABIVoting, signer);
      const tx = await contract.createCandidate(formData.name, formData.description);
      await tx.wait();
      setFormData({ name: '', description: '' })
      setShowForm(false);
      getAllCandidates();
      getInformation({ signer, provider, setBalance })
    } catch (error: any) {
      console.log('error', error)
    }
  }

  const getAllCandidates = async () => {
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS_VOTING, contractABIVoting, signer);
      const candidates = await contract.getAllCandidates();


      const candidatesArray: Candidate[] = [];

      candidates.map((candidate: { name: string; desc: string }, index: number) => {
        const newCandidate: Candidate = {
          id: index,
          name: candidate.name,
          description: candidate.desc
        }
        candidatesArray.push(newCandidate)
      })

      setCandidates(candidatesArray);
    } catch (error: any) {
      console.log('error', error)
    }
  }

  const navigateToRegister = () => {
    router.push('/register');
  }


  useEffect(() => {
    if (signer) {
      getAllCandidates();
      checkIsOwner();
      checkHasVoted();
    }
  }, [signer]);


  if (!provider) {
    return <div>Loading...</div>;
  }


  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        {/* <Button onClick={getAllCandidates} variant={"secondary"} className="mr-4">get all candidate</Button> */}
        <Button onClick={navigateToRegister} variant={"secondary"} className="mr-4">Register</Button>
        {!showForm && isOwner && (
          <Button onClick={() => setShowForm(true)}>Create Candidate</Button>
        )}

        {showForm && isOwner && (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Add New Candidate</CardTitle>
            </CardHeader>
            <form onSubmit={createCandidate}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter candidate name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter candidate description"
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">Submit</Button>
              </CardFooter>
            </form>
          </Card>
        )}
      </div>
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Candidate List</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} checkVoted={checkHasVoted} hasVoted={hasVoted} />
          ))}
        </div>
      </div>
    </div>
  );
}

