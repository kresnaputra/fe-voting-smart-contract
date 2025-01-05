'use client';

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { useEthersStore } from '@/store/ethers-store';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS_USER, contractABIUser } from '@/lib/utils';

export default function RegisterPage() {
  const { signer } = useEthersStore();


  const [formData, setFormData] = useState({ id: '', name: '' })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS_USER, contractABIUser, signer);
      const tx = await contract.add(formData.name, formData.id);
      await tx.wait();
      setFormData({ id: '', name: '' })
    } catch (error: any) {
      console.log('error', error)
      alert(error.reason)
    }

  }

  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">User Registration</h1>
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Register</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="id">ID</Label>
                <Input
                  id="id"
                  name="id"
                  value={formData.id}
                  onChange={handleInputChange}
                  placeholder="Enter your ID"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">
                Register
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  )
}


