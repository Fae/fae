// @ifdef DEBUG
export function ASSERT(bool, message)
{
    if (!bool) throw new Error(`[Fay ASSERT]: ${message}`);
};
// @endif
