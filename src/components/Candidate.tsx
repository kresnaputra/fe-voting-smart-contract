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

function CandidateCard({ candidate }: { candidate: Candidate }) {
  const { signer } = useEthersStore();

  const vote = async () => {
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS_VOTING, contractABIVoting, signer);
      const tx = await contract.vote(candidate.id);
      await tx.wait();
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
        <Button onClick={vote} className='mt-2'>Vote</Button>
      </div>
    </div>
  )
}

export default CandidateCard;
