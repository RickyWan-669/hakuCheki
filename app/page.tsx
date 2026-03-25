"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface Member {
  name: string
  bgColor: string
  textColor: string
  borderColor: string
}

interface MemberInput {
  regular: number
  newFan: number
  groupPhoto: number
  birthday: number
  solo: number
}

interface MemberResult {
  name: string
  memberEarnings: number
  companyEarnings: number
  breakdown: string
}

const MEMBERS: Member[] = [
  { name: "Paon", bgColor: "bg-gray-100", textColor: "text-gray-800", borderColor: "border-gray-400" },
  { name: "Hiyori", bgColor: "bg-purple-100", textColor: "text-purple-800", borderColor: "border-purple-400" },
  { name: "PuiPui", bgColor: "bg-pink-100", textColor: "text-pink-800", borderColor: "border-pink-400" },
  { name: "Airin", bgColor: "bg-blue-200", textColor: "text-blue-900", borderColor: "border-blue-500" },
  { name: "Himari", bgColor: "bg-yellow-100", textColor: "text-yellow-800", borderColor: "border-yellow-400" },
  { name: "Kori", bgColor: "bg-sky-100", textColor: "text-sky-800", borderColor: "border-sky-400" },
]

const CHEKI_PRICE = 60

export default function IdolPaymentCalculator() {
  const [eventDate, setEventDate] = useState("")
  const [inputs, setInputs] = useState<Record<string, MemberInput>>(
    Object.fromEntries(
      MEMBERS.map((m) => [
        m.name,
        { regular: 0, newFan: 0, groupPhoto: 0, birthday: 0, solo: 0 },
      ])
    )
  )
  const [results, setResults] = useState<MemberResult[] | null>(null)
  const [totalCompanyEarnings, setTotalCompanyEarnings] = useState(0)

  const updateInput = (
    member: string,
    field: keyof MemberInput,
    value: string
  ) => {
    const numValue = parseInt(value) || 0
    setInputs((prev) => ({
      ...prev,
      [member]: {
        ...prev[member],
        [field]: numValue,
      },
    }))
  }

  const calculate = () => {
    let companyTotal = 0
    const memberResults: MemberResult[] = MEMBERS.map((member) => {
      const input = inputs[member.name]
      
      const regularMember = input.regular * 30
      const regularCompany = input.regular * 30
      
      const newFanMember = input.newFan * 5
      const newFanCompany = 0
      
      const groupPhotoMember = input.groupPhoto * 25
      const groupPhotoCompany = input.groupPhoto * (CHEKI_PRICE - 25)
      
      const birthdayMember = input.birthday * CHEKI_PRICE * 0.6
      const birthdayCompany = input.birthday * CHEKI_PRICE * 0.4
      
      const soloMember = input.solo * CHEKI_PRICE * 0.7
      const soloCompany = input.solo * CHEKI_PRICE * 0.3
      
      const memberEarnings = regularMember + newFanMember + groupPhotoMember + birthdayMember + soloMember
      const companyEarnings = regularCompany + newFanCompany + groupPhotoCompany + birthdayCompany + soloCompany
      
      companyTotal += companyEarnings
      
      const parts: string[] = []
      if (input.regular > 0) parts.push(`${input.regular} 普通`)
      if (input.newFan > 0) parts.push(`${input.newFan} 新規`)
      if (input.groupPhoto > 0) parts.push(`${input.groupPhoto} 全員`)
      if (input.birthday > 0) parts.push(`${input.birthday} 生誕祭`)
      if (input.solo > 0) parts.push(`${input.solo} Solo`)
      
      return {
        name: member.name,
        memberEarnings,
        companyEarnings,
        breakdown: parts.join(" + ") || "無",
      }
    })
    
    setResults(memberResults)
    setTotalCompanyEarnings(companyTotal)
  }

  const copyResults = () => {
    if (!results) return
    
    let text = eventDate ? `${eventDate}\n\n` : ""
    
    results.forEach((r) => {
      if (r.memberEarnings > 0) {
        text += `${r.name}\n${r.breakdown} $${r.memberEarnings}\n\n`
      }
    })
    
    text += `公司總收入: $${totalCompanyEarnings}`
    
    navigator.clipboard.writeText(text)
  }

  const reset = () => {
    setInputs(
      Object.fromEntries(
        MEMBERS.map((m) => [
          m.name,
          { regular: 0, newFan: 0, groupPhoto: 0, birthday: 0, solo: 0 },
        ])
      )
    )
    setResults(null)
    setTotalCompanyEarnings(0)
    setEventDate("")
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-4 px-3 sm:py-8 sm:px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-1 text-gray-800">
          Hakuchuumi出糧計算器
        </h1>
        <p className="text-center text-sm text-muted-foreground mb-4 sm:mb-6">
          計算每位成員應得的收入和公司收益
        </p>

        {/* Price Info - Collapsible on mobile */}
        <details className="mb-4 sm:mb-6">
          <summary className="cursor-pointer bg-white rounded-lg p-3 font-medium text-sm shadow-sm">
            查看收費及分成比例
          </summary>
          <div className="mt-2 bg-white rounded-lg p-3 shadow-sm">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-xs sm:text-sm">
              <div className="p-2 bg-gray-50 rounded-lg">
                <p className="font-medium">普通</p>
                <p className="text-muted-foreground">$60 (50/50)</p>
                <p className="text-green-600">成員: $30</p>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg">
                <p className="font-medium">新規</p>
                <p className="text-muted-foreground">新粉優惠</p>
                <p className="text-green-600">成員: $5</p>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg">
                <p className="font-medium">全員合照</p>
                <p className="text-muted-foreground">團體照</p>
                <p className="text-green-600">每位: $25</p>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg">
                <p className="font-medium">生誕祭</p>
                <p className="text-muted-foreground">$60 (60/40)</p>
                <p className="text-green-600">成員: $36</p>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg col-span-2 sm:col-span-1">
                <p className="font-medium">Solo</p>
                <p className="text-muted-foreground">$60 (70/30)</p>
                <p className="text-green-600">成員: $42</p>
              </div>
            </div>
          </div>
        </details>

        {/* Date Input */}
        <div className="mb-4">
          <Label htmlFor="date" className="text-sm font-medium">活動日期</Label>
          <Input
            id="date"
            type="text"
            placeholder="例如: 21/3"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="mt-1 max-w-[150px]"
          />
        </div>

        {/* Member Inputs - Optimized for mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {MEMBERS.map((member) => (
            <Card 
              key={member.name} 
              className={`border-2 ${member.borderColor} overflow-hidden`}
            >
              <CardHeader className={`${member.bgColor} py-2 px-3`}>
                <CardTitle className={`text-base ${member.textColor}`}>
                  {member.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="grid grid-cols-5 gap-1.5">
                  <div>
                    <Label className="text-[10px] block text-center mb-1">普通</Label>
                    <Input
                      type="number"
                      inputMode="numeric"
                      min="0"
                      value={inputs[member.name]?.regular || ""}
                      onChange={(e) =>
                        updateInput(member.name, "regular", e.target.value)
                      }
                      placeholder="0"
                      className="text-center text-sm h-9 px-1"
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] block text-center mb-1">新規</Label>
                    <Input
                      type="number"
                      inputMode="numeric"
                      min="0"
                      value={inputs[member.name]?.newFan || ""}
                      onChange={(e) =>
                        updateInput(member.name, "newFan", e.target.value)
                      }
                      placeholder="0"
                      className="text-center text-sm h-9 px-1"
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] block text-center mb-1">全員</Label>
                    <Input
                      type="number"
                      inputMode="numeric"
                      min="0"
                      value={inputs[member.name]?.groupPhoto || ""}
                      onChange={(e) =>
                        updateInput(member.name, "groupPhoto", e.target.value)
                      }
                      placeholder="0"
                      className="text-center text-sm h-9 px-1"
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] block text-center mb-1">生誕祭</Label>
                    <Input
                      type="number"
                      inputMode="numeric"
                      min="0"
                      value={inputs[member.name]?.birthday || ""}
                      onChange={(e) =>
                        updateInput(member.name, "birthday", e.target.value)
                      }
                      placeholder="0"
                      className="text-center text-sm h-9 px-1"
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] block text-center mb-1">Solo</Label>
                    <Input
                      type="number"
                      inputMode="numeric"
                      min="0"
                      value={inputs[member.name]?.solo || ""}
                      onChange={(e) =>
                        updateInput(member.name, "solo", e.target.value)
                      }
                      placeholder="0"
                      className="text-center text-sm h-9 px-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-3 mb-4">
          <Button onClick={calculate} size="lg" className="flex-1 max-w-[200px]">
            計算
          </Button>
          <Button onClick={reset} variant="outline" size="lg" className="flex-1 max-w-[200px]">
            重置
          </Button>
        </div>

        {/* Results */}
        {results && (
          <Card className="mb-4">
            <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
              <CardTitle className="text-base">
                計算結果 {eventDate && `- ${eventDate}`}
              </CardTitle>
              <Button variant="outline" size="sm" onClick={copyResults}>
                複製
              </Button>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                {results.filter(r => r.memberEarnings > 0).map((r) => {
                  const member = MEMBERS.find((m) => m.name === r.name)!
                  return (
                    <div
                      key={r.name}
                      className={`p-3 rounded-lg ${member.bgColor} border ${member.borderColor}`}
                    >
                      <h3 className={`font-bold text-sm ${member.textColor}`}>
                        {r.name}
                      </h3>
                      <p className="text-xs text-gray-600 mt-0.5 truncate">{r.breakdown}</p>
                      <p className={`text-lg font-bold mt-1 ${member.textColor}`}>
                        ${r.memberEarnings}
                      </p>
                    </div>
                  )
                })}
              </div>
              
              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">公司總收入:</span>
                  <span className="text-xl font-bold text-primary">
                    ${totalCompanyEarnings}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Text Output Preview */}
        {results && (
          <Card>
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-base">輸出文字</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <pre className="bg-gray-50 p-3 rounded-lg text-xs sm:text-sm whitespace-pre-wrap font-mono overflow-x-auto">
                {eventDate && `${eventDate}\n\n`}
                {results
                  .filter((r) => r.memberEarnings > 0)
                  .map(
                    (r) => `${r.name}\n${r.breakdown} $${r.memberEarnings}\n`
                  )
                  .join("\n")}
                {`\n公司總收入: $${totalCompanyEarnings}`}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
