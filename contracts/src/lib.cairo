use starknet::contract_address::ContractAddress;

#[derive(Drop, Serde)]
enum RoundState {
    Active,
    Ended,
}

#[starknet::interface]
pub trait IMoonOrDoom<TContractState> {
    fn start_round(ref self: TContractState, start_price: u128);
    fn end_round(ref self: TContractState, end_price: u128);
    fn bet(ref self: TContractState, moon: bool);

    fn get_round_info(self: @TContractState) -> (RoundState, u64, u64, u128, u128);
    fn get_bet_info(self: @TContractState, user:ContractAddress, round_index: u256) -> (bool);
}

#[starknet::contract]
mod MoonOrDoom {
    use starknet::contract_address::ContractAddress;
    use starknet::{get_block_timestamp, get_caller_address};
    use starknet::storage::{
        Map, StorageMapReadAccess, StorageMapWriteAccess, StoragePointerReadAccess,
        StoragePointerWriteAccess
    };
    use super::RoundState;

    struct Round {
        state: RoundState,
        start_timestamp: u64,
        end_timestamp: u64,
        start_price: u128,
        end_price: u128,
    }

    struct Bet {
        moon: bool,
    }

    #[storage]
    struct Storage {
        round_count: u256,
        rounds: Map::<u256, Round>,
        bets: Map::<ContractAddress, Map::<u256, Bet>>,
        test: Map::<u256, u256>,
    }

    #[constructor]
    fn constructor(ref self: ContractState) {
        self.round_count.write(0);
    }

    #[abi(embed_v0)]
    impl MoonOrDoomImpl of super::IMoonOrDoom<ContractState> {
        fn start_round(ref self: ContractState, start_price: u128) {
            let round_count = self.round_count.read();
            let round = Round {
                state: RoundState::Active,
                start_timestamp: get_block_timestamp(),
                end_timestamp: 0,
                start_price: start_price,
                end_price: 0,
            };

            self.rounds.entry(round_count).write(round);
            self.round_count.write(round_count + 1);
        }

        fn end_round(ref self: ContractState, end_price: u128) {
            let round_count = self.round_count.read();
            let round = self.rounds.entry(round_count).read();
            round.end_price.write(end_price);
            self.rounds.entry(round_count).write(round);
        }

        fn bet(ref self: ContractState, moon: bool) {
            let round_count = self.round_count.read();
            let round = self.rounds.entry(round_count).read();
            let caller = get_caller_address();

            assert(round.state == RoundState::Active, "Round is not active");
            
            let bet = Bet {
                moon: moon,
            };


            self.bets.entry(caller).entry(round_count).write(bet);
        }

        fn get_round_info(self: @ContractState) -> (RoundState, u64, u64, u128, u128) {
            let round_count = self.round_count.read();
            let Round {state, start_timestamp, end_timestamp, start_price, end_price} = self.rounds.entry(round_count).read();
            
            (state, start_timestamp, end_timestamp, start_price, end_price)
        }

        fn get_bet_info(self: @ContractState, user: ContractAddress, round_index: u256) -> (bool) {
            let bet =self.bets.entry(user).entry(round_index).read();
            
            bet.moon
        }
        
    }
}
