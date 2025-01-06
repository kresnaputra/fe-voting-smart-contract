import { User } from 'lucide-react'
import { Button } from './ui/button'
import { ethers } from 'ethers'
import { CONTRACT_ADDRESS_VOTING, contractABIVoting } from '@/lib/utils'
import { useEthersStore } from '@/store/ethers-store'

export interface Candidate {
  id: number
  name: string
  description: string
}

function CandidateCard({ candidate, checkVoted, hasVoted, isOwner, getCandidates }: { candidate: Candidate, checkVoted: () => void, hasVoted: boolean, isOwner: boolean, getCandidates: () => void }) {
  const { signer } = useEthersStore();

  const vote = async () => {
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS_VOTING, contractABIVoting, signer);
      const tx = await contract.vote(candidate.id);
      await tx.wait();
      checkVoted();
    } catch (error: any) {
      alert(error.reason)
    }
  }

  const deleteCandidate = async () => {
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS_VOTING, contractABIVoting, signer);
      const tx = await contract.removeCandidate(candidate.id);
      await tx.wait();
      checkVoted();
      getCandidates();
    } catch (error: any) {
      alert(error.reason)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
            <User className="w-6 h-6 text-gray-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{candidate.name}</h3>
          </div>
        </div>
        <p className="text-sm text-gray-700">{candidate.description}</p>
        <div className='mt-2'>
          {!hasVoted && (
            <Button onClick={vote} >Vote</Button>
          )}
          {isOwner && (
            <Button onClick={deleteCandidate} variant={"destructive"} className={!hasVoted ? 'ml-2' : 'ml-0'}>Delete</Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default CandidateCard;
