"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface Member {
  name: string
  color: string
  bgColor: string
  textColor: string
}

interface MemberInput {
  regular: number // 普通 Cheki ($60 total, 50/50 split)
  newFan: number // 新規 Cheki (member gets $5)
  groupPhoto: number // 全員合照 (member gets $25)
  birthday: number // 生誕祭 Cheki (60/40 split)
  solo: number // Solo Cheki (70/30 split)
}

interface MemberResult {
  name: string
  color: string
  memberEarnings: number
  companyEarnings: number
  breakdown: string
}

const MEMBERS: Member[] = [
  { name: "Paon", color: "白色", bgColor: "bg-gray-100", textColor: "text-gray-800" },
  { name: "Hiyori", color: "紫色", bgColor: "bg-purple-100", textColor: "text-purple-800" },
  { name: "PuiPui", color: "粉紅色", bgColor: "bg-pink-100", textColor: "text-pink-800" },
  { name: "Airin", color: "深藍色", bgColor: "bg-blue-200", textColor: "text-blue-900" },
  { name: "Himari", color: "黃色", bgColor: "bg-yellow-100", textColor: "text-yellow-800" },
  { name: "Kori", color: "淺藍色", bgColor: "bg-sky-100", textColor: "text-sky-800" },
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
      
      // Regular Cheki: $60 total, 50/50 split -> member $30, company $30
      const regularMember = input.regular * 30
      const regularCompany = input.regular * 30
      
      // New Fan Cheki: member gets $5
      const newFanMember = input.newFan * 5
      const newFanCompany = 0
      
      // Group Photo: member gets $25 (assuming $60 price, rest to company)
      const groupPhotoMember = input.groupPhoto * 25
      const groupPhotoCompany = input.groupPhoto * (CHEKI_PRICE - 25)
      
      // Birthday Cheki: 60/40 split (member 60%, company 40%)
      const birthdayMember = input.birthday * CHEKI_PRICE * 0.6
      const birthdayCompany = input.birthday * CHEKI_PRICE * 0.4
      
      // Solo Cheki: 70/30 split (member 70%, company 30%)
      const soloMember = input.solo * CHEKI_PRICE * 0.7
      const soloCompany = input.solo * CHEKI_PRICE * 0.3
      
      const memberEarnings = regularMember + newFanMember + groupPhotoMember + birthdayMember + soloMember
      const companyEarnings = regularCompany + newFanCompany + groupPhotoCompany + birthdayCompany + soloCompany
      
      companyTotal += companyEarnings
      
      // Build breakdown string
      const parts: string[] = []
      if (input.regular > 0) parts.push(`${input.regular} 普通`)
      if (input.newFan > 0) parts.push(`${input.newFan} 新規`)
      if (input.groupPhoto > 0) parts.push(`${input.groupPhoto} 全員`)
      if (input.birthday > 0) parts.push(`${input.birthday} 生誕祭`)
      if (input.solo > 0) parts.push(`${input.solo} Solo`)
      
      return {
        name: member.name,
        color: member.color,
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

  const getMemberBorderColor = (name: string) => {
    switch (name) {
      case "Paon": return "border-gray-400"
      case "Hiyori": return "border-purple-400"
      case "PuiPui": return "border-pink-400"
      case "Airin": return "border-blue-500"
      case "Himari": return "border-yellow-400"
      case "Kori": return "border-sky-400"
      default: return "border-gray-300"
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
          地下偶像出糧計算器
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          計算每位成員應得的收入和公司收益
        </p>

        {/* Price Info */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">收費及分成比例</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">普通 Cheki</p>
                <p className="text-muted-foreground">$60 (50/50分成)</p>
                <p className="text-xs text-green-600">成員: $30</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">新規 Cheki</p>
                <p className="text-muted-foreground">新粉優惠</p>
                <p className="text-xs text-green-600">成員: $5</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">全員合照</p>
                <p className="text-muted-foreground">團體照</p>
                <p className="text-xs text-green-600">每位成員: $25</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">生誕祭 Cheki</p>
                <p className="text-muted-foreground">$60 (60/40分成)</p>
                <p className="text-xs text-green-600">成員: $36</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">Solo Cheki</p>
                <p className="text-muted-foreground">$60 (70/30分成)</p>
                <p className="text-xs text-green-600">成員: $42</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Date Input */}
        <div className="mb-6">
          <Label htmlFor="date" className="text-base font-medium">活動日期</Label>
          <Input
            id="date"
            type="text"
            placeholder="例如: 21/3"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="max-w-xs mt-2"
          />
        </div>

        {/* Member Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {MEMBERS.map((member) => (
            <Card 
              key={member.name} 
              className={`border-2 ${getMemberBorderColor(member.name)}`}
            >
              <CardHeader className={`${member.bgColor} pb-3`}>
                <CardTitle className={`text-lg ${member.textColor}`}>
                  {member.name}
                  <span className="text-sm font-normal ml-2">({member.color})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">普通 Cheki</Label>
                    <Input
                      type="number"
                      min="0"
                      value={inputs[member.name]?.regular || ""}
                      onChange={(e) =>
                        updateInput(member.name, "regular", e.target.value)
                      }
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">新規 Cheki</Label>
                    <Input
                      type="number"
                      min="0"
                      value={inputs[member.name]?.newFan || ""}
                      onChange={(e) =>
                        updateInput(member.name, "newFan", e.target.value)
                      }
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">全員合照</Label>
                    <Input
                      type="number"
                      min="0"
                      value={inputs[member.name]?.groupPhoto || ""}
                      onChange={(e) =>
                        updateInput(member.name, "groupPhoto", e.target.value)
                      }
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">生誕祭 Cheki</Label>
                    <Input
                      type="number"
                      min="0"
                      value={inputs[member.name]?.birthday || ""}
                      onChange={(e) =>
                        updateInput(member.name, "birthday", e.target.value)
                      }
                      placeholder="0"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs">Solo Cheki</Label>
                    <Input
                      type="number"
                      min="0"
                      value={inputs[member.name]?.solo || ""}
                      onChange={(e) =>
                        updateInput(member.name, "solo", e.target.value)
                      }
                      placeholder="0"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Calculate Button */}
        <div className="flex justify-center mb-6">
          <Button onClick={calculate} size="lg" className="px-12">
            計算
          </Button>
        </div>

        {/* Results */}
        {results && (
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>計算結果 {eventDate && `- ${eventDate}`}</CardTitle>
              <Button variant="outline" size="sm" onClick={copyResults}>
                複製結果
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {results.map((r) => {
                  const member = MEMBERS.find((m) => m.name === r.name)!
                  return (
                    <div
                      key={r.name}
                      className={`p-4 rounded-lg ${member.bgColor} border-2 ${getMemberBorderColor(r.name)}`}
                    >
                      <h3 className={`font-bold text-lg ${member.textColor}`}>
                        {r.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{r.breakdown}</p>
                      <p className={`text-xl font-bold mt-2 ${member.textColor}`}>
                        ${r.memberEarnings}
                      </p>
                    </div>
                  )
                })}
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">公司總收入:</span>
                  <span className="text-2xl font-bold text-primary">
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
            <CardHeader>
              <CardTitle className="text-lg">輸出文字格式</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-50 p-4 rounded-lg text-sm whitespace-pre-wrap font-mono">
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
