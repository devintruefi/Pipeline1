import { describe, it, expect } from "vitest";
import { selectPlay, PLAYS } from "@/lib/plays";

describe("play selection", () => {
  it("warm intro wins when there's a mutual connection", () => {
    expect(
      selectPlay({ status: "watch", signalId: null, hasMutualConnection: true } as never)
    ).toBe("warm_intro");
  });

  it("re-engage wins when explicitly flagged", () => {
    expect(
      selectPlay({ status: "snoozed", signalId: null, isReengage: true } as never)
    ).toBe("re_engage");
  });

  it("newsjack on a fresh funding round (≤2 days)", () => {
    expect(
      selectPlay({
        status: "watch",
        signalId: "x",
        signal: { kind: "funding", detectedAt: new Date() },
        daysSinceSignal: 1
      } as never)
    ).toBe("newsjacking");
  });

  it("tailored app + backchannel on a posted role", () => {
    expect(
      selectPlay({
        status: "watch",
        signalId: "x",
        signal: { kind: "role_posted", detectedAt: new Date() }
      } as never)
    ).toBe("tailored_app_backchannel");
  });

  it("direct exec cold email on a leadership change", () => {
    expect(
      selectPlay({
        status: "hot",
        signalId: "x",
        signal: { kind: "leadership_change", detectedAt: new Date() }
      } as never)
    ).toBe("direct_exec_cold_email");
  });

  it("library has all 7 plays", () => {
    expect(Object.keys(PLAYS).sort()).toEqual([
      "direct_exec_cold_email",
      "event_convergence",
      "newsjacking",
      "quiet_apply",
      "re_engage",
      "tailored_app_backchannel",
      "warm_intro"
    ]);
  });
});
