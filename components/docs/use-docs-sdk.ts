"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useMemo } from "react"
import { DEFAULT_SDK_ID, getSdkOrDefault } from "@/lib/docs/sdk-registry"
import { getSnippetsForSdkSafe } from "@/lib/docs/sdk-snippets"
import type { SdkDefinition } from "@/lib/docs/sdk-registry"
import type { SdkSnippets } from "@/lib/docs/sdk-snippets"

export function useDocsSdk() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sdkId = searchParams.get("sdk") ?? DEFAULT_SDK_ID
  const sdk = useMemo(() => getSdkOrDefault(sdkId), [sdkId])
  const isAvailable = sdk.status === "available" || sdk.status === "beta"

  const snippets = useMemo(
    () => getSnippetsForSdkSafe(sdk) as SdkSnippets,
    [sdk],
  )

  const setSdk = useCallback(
    (id: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("sdk", id)
      router.replace(`/docs?${params.toString()}`, { scroll: false })
    },
    [router, searchParams],
  )

  return { sdk, sdkId, isAvailable, snippets, setSdk } satisfies {
    sdk: SdkDefinition
    sdkId: string
    isAvailable: boolean
    snippets: SdkSnippets
    setSdk: (id: string) => void
  }
}
