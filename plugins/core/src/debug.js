// @ifdef DEBUG
export function ASSERT(bool, message)
{
    if (!bool) throw new Error(`[Fae ASSERT] ${message}`);
}
// @endif
