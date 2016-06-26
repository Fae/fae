// @ifdef DEBUG
export default {
    ASSERT(bool, message)
    {
        if (!bool) throw new Error(message);
    },
};
// @endif
