import { Avatar, AvatarImage, AvatarFallback } from "./avatar";

/**
 * Avatar Component Examples
 *
 * This file demonstrates various use cases for the Avatar component.
 * You can use this for testing or as a reference.
 */

export function AvatarExamples() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Avatar Component Examples</h1>

      {/* Example 1: Avatar with Image */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">1. With Image</h2>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>

      {/* Example 2: Avatar with Fallback (no image) */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">2. Fallback Only</h2>
        <Avatar>
          <AvatarImage src="" alt="No image" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      </div>

      {/* Example 3: Different Sizes */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">3. Different Sizes</h2>
        <div className="flex items-center gap-4">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">SM</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>MD</AvatarFallback>
          </Avatar>
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg">LG</AvatarFallback>
          </Avatar>
          <Avatar className="h-24 w-24">
            <AvatarFallback className="text-2xl">XL</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Example 4: Custom Colors */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">4. Custom Colors</h2>
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarFallback className="bg-red-100 text-red-600">AB</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback className="bg-blue-100 text-blue-600">CD</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback className="bg-green-100 text-green-600">EF</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback className="bg-purple-100 text-purple-600">GH</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Example 5: With Border */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">5. With Border</h2>
        <Avatar className="border-2 border-primary">
          <AvatarFallback>BR</AvatarFallback>
        </Avatar>
      </div>

      {/* Example 6: User List */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">6. User List Example</h2>
        <div className="space-y-3">
          {[
            { name: "John Doe", initials: "JD", color: "bg-blue-100 text-blue-600" },
            { name: "Jane Smith", initials: "JS", color: "bg-pink-100 text-pink-600" },
            { name: "Bob Wilson", initials: "BW", color: "bg-green-100 text-green-600" },
            { name: "Alice Brown", initials: "AB", color: "bg-purple-100 text-purple-600" },
          ].map((user) => (
            <div key={user.initials} className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className={user.color}>
                  {user.initials}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">{user.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Example 7: Stacked Avatars */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">7. Stacked Avatars</h2>
        <div className="flex -space-x-2">
          <Avatar className="border-2 border-white">
            <AvatarFallback className="bg-red-100 text-red-600">A</AvatarFallback>
          </Avatar>
          <Avatar className="border-2 border-white">
            <AvatarFallback className="bg-blue-100 text-blue-600">B</AvatarFallback>
          </Avatar>
          <Avatar className="border-2 border-white">
            <AvatarFallback className="bg-green-100 text-green-600">C</AvatarFallback>
          </Avatar>
          <Avatar className="border-2 border-white">
            <AvatarFallback className="bg-purple-100 text-purple-600">D</AvatarFallback>
          </Avatar>
          <Avatar className="border-2 border-white">
            <AvatarFallback className="bg-gray-100 text-gray-600">+5</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Example 8: Real-world Usage (Gig Card) */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">8. Real-world Usage (Gig Card Style)</h2>
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6 border border-border">
            <AvatarFallback className="text-xs bg-primary/10 text-primary">
              JD
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium">John Doe</span>
        </div>
      </div>
    </div>
  );
}

// Helper function to generate initials from name
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Helper function to generate color from string (consistent colors for same names)
export function getColorFromString(str: string): string {
  const colors = [
    "bg-red-100 text-red-600",
    "bg-blue-100 text-blue-600",
    "bg-green-100 text-green-600",
    "bg-yellow-100 text-yellow-600",
    "bg-purple-100 text-purple-600",
    "bg-pink-100 text-pink-600",
    "bg-indigo-100 text-indigo-600",
    "bg-teal-100 text-teal-600",
  ];

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}
