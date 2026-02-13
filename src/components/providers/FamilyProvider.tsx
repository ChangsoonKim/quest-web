import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { familyApi } from "@/lib/api"
import { useFamilyStore } from "@/stores/useFamilyStore"
import { useAuthStore } from "@/stores/useAuthStore"

interface FamilyProviderProps {
  children: React.ReactNode
}

export function FamilyProvider({ children }: FamilyProviderProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const setFamilies = useFamilyStore((state) => state.setFamilies)

  const { data } = useQuery({
    queryKey: ["user-families"],
    queryFn: familyApi.getUserFamilies,
    enabled: isAuthenticated,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  useEffect(() => {
    if (data?.data) {
      const families = data.data.map((item) => ({
        id: item.family.id,
        name: item.family.name,
        role: item.member.role,
        nickname: item.member.nickname,
        joinedAt: item.member.joinedAt,
      }))
      setFamilies(families)
    }
  }, [data, setFamilies])

  return <>{children}</>
}
