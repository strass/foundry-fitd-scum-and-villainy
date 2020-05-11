const generic = {
  name: "",
  description: "",
};

const veteran = {
  name: "Veteran",
  description: "Choose a special ability from another",
  max: 3,
};

const moves: Record<
  string,
  { name: string; starting?: boolean; description: string }[]
> = {
  mechanic: [
    {
      name: "Tinker",
      starting: true,
      description:
        "When you work on a clock with **rig** or **hack**, or when you **study** a schematic, fill **+1 segment**.",
    },
    {
      name: "Bailing Wire and Mech-Tape",
      description:
        "You get an extra **downtime activity** to **repair**, and the repair activity costs you **0 cred**.",
    },
    {
      name: "Construct Whisperer",
      description:
        "Machines speak to you when you study them. The first time you roll a critical while fixing or building a particular machine, you may add a simple modification to it.",
    },
    {
      name: "Junkyard Hunter",
      description:
        "When you acquire parts or equipment during downtime, you may either gain two assets, or one asset at +1 quality.",
    },
    {
      name: "Hacker",
      description:
        "You may expend your special armor to resist the consequences of hacking, or to push yourself when hacking or gathering info electronically.",
    },
    {
      name: "Fixed",
      description:
        " You may expend your special armor to resist a consequence from machines breaking or being damaged, or to push yourself when repairing or building a machine. ",
    },
    {
      name: "Mechanic's Heart",
      description:
        "When you speak from your heart, your words can reach even the most hardened criminal, and you gain potency.",
    },
    {
      name: "Overclock",
      description:
        "When you spend a gambit on a rig roll to repair or upgrade, treat the system you worked on as 1 quality higher for the remainder of the job.",
    },
    {
      name: "Analyst",
      description:
        "When you hack a system, you may also ask a question about the owner or location of the system as though you had rolled a 6 on gather info. When you resist the consequences of hacking, roll +1d.",
    },
    veteran,
  ],
};

export default moves;
