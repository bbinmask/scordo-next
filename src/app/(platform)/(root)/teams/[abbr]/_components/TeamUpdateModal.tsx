import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Team, TeamType } from "@/generated/prisma";
import { TeamForListComponent, TeamRequestWithDetails, TeamWithPlayers } from "@/lib/types";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CheckCircle, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
  abbreviation: z
    .string()
    .min(2, "Abbreviation must be 2-4 characters.")
    .max(4, "Abbreviation must be 2-4 characters."),
  logo: z.string().url("Must be a valid URL.").optional().or(z.literal("")),
  banner: z.string().url("Must be a valid URL.").optional().or(z.literal("")),
  type: z.nativeEnum(TeamType, {
    error: "Please select a team type.",
  }),
  isRecruiting: z.boolean().default(false),
  address: z.object({
    city: z.string().min(1, "City is required."),
    state: z.string().min(1, "State is required."),
    country: z.string().min(1, "Country is required."),
  }),
  captainId: z.string().optional().or(z.literal("")),
});

interface TeamUpdateModalProps {
  team: TeamWithPlayers;
}

const TeamUpdateModal = ({ team }: TeamUpdateModalProps) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      abbreviation: team.abbreviation,
      isRecruiting: team?.isRecruiting,
      address: team?.address || {
        city: "",
        state: "",
        country: "",
      },
      name: team.name,
      type: team.type,
      captainId: team?.captainId || "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("Updating team data:", data);
    // In a real app, you'd call your API here
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Name and Abbreviation (Side-by-side) */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team Name</FormLabel>
              <FormControl>
                <Input placeholder="E.g., Mumbai Rockets" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="abbreviation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Abbreviation</FormLabel>
              <FormControl>
                <Input placeholder="E.g., MR" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Logo and Banner URLs */}
      <FormField
        control={form.control}
        name="logo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Logo URL</FormLabel>
            <FormControl>
              <Input placeholder="https://example.com/logo.png" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="banner"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Banner URL</FormLabel>
            <FormControl>
              <Input placeholder="https://example.com/banner.png" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Team Type and Captain (Side-by-side) */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a team type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(TeamType).map((type) => (
                    <SelectItem key={type} value={type} className="capitalize">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* --- NEW CAPTAIN FIELD --- */}
        <FormField
          control={form.control}
          name="captainId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Captain</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a captain" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {team.players.map((player) => (
                    <SelectItem key={player.id} value={player.user.id}>
                      {player.user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Assign a captain from your team's roster.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* --- END NEW FIELD --- */}
      </div>

      {/* Address Fields (Grid) */}
      <div>
        <Label className="text-sm font-semibold text-gray-700">Address</Label>
        <div className="mt-2 grid grid-cols-1 gap-6 md:grid-cols-3">
          <FormField
            control={form.control}
            name="address.city"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="City" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address.state"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="State" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address.country"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Country" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Is Recruiting Switch */}
      <FormField
        control={form.control}
        name="isRecruiting"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel>Recruiting Players</FormLabel>
              <FormDescription>
                Allow players to find and send join requests to your team.
              </FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />

      <div className="flex items-center justify-end space-x-4">
        {/* {isSuccess && (
          <div className="flex items-center text-green-600">
            <CheckCircle className="mr-2 h-5 w-5" />
            <span>Saved successfully!</span>
          </div>
        )} */}
        <Button type="submit">
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default TeamUpdateModal;
