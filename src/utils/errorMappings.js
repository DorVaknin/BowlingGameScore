const ErrorMappings = {
    Game_not_found: 'Game not found',
    Game_already_completed_No_more_rolls_can_be_recorded: 'Game already completed. No more rolls can be recorded.',
    Exceeds_single_roll_limit: 'Invalid roll: cannot knock down more than 10 pins in a single roll.',
    Exceeds_frame_roll_limit: 'Invalid roll: total pins in two rolls of a frame cannot exceed 10.',
    Exceeds_bonus_roll_limit: 'Invalid roll: cannot knock down more than 10 pins in a bonus roll.',
    Exceeds_frame_limit: 'Invalid roll: total pins in a frame cannot exceed 10.'
};

  module.exports = ErrorMappings;
  